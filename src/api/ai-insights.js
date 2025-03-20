const express = require("express")
const router = express.Router()
const axios = require("axios")

// OpenAI API 설정
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

// 마감일 위험 예측
router.post("/deadline-risk", async (req, res) => {
  try {
    const { tasks, userId } = req.body

    // 진행 중이거나 시작 전인 작업만 필터링
    const pendingTasks = tasks.filter((task) => task.status !== "DONE")

    if (pendingTasks.length === 0) {
      return res.json({
        riskTasks: [],
      })
    }

    // 현재 날짜
    const now = new Date()

    // 마감일이 있는 작업만 필터링하고 위험도 계산
    const tasksWithRisk = pendingTasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const dueDate = new Date(task.dueDate)
        const daysLeft = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24))

        let riskLevel = "low"
        if (daysLeft < 0) {
          riskLevel = "high" // 이미 마감일 지남
        } else if (daysLeft < 2) {
          riskLevel = "high" // 2일 이내
        } else if (daysLeft < 5) {
          riskLevel = "medium" // 5일 이내
        }

        return {
          ...task,
          daysLeft,
          riskLevel,
        }
      })

    // 위험도가 높거나 중간인 작업만 필터링
    const riskTasks = tasksWithRisk
      .filter((task) => task.riskLevel === "high" || task.riskLevel === "medium")
      .sort((a, b) => a.daysLeft - b.daysLeft)

    if (riskTasks.length === 0) {
      return res.json({
        riskTasks: [],
      })
    }

    // OpenAI API를 사용하여 위험 작업에 대한 분석 및 제안 생성
    const messages = [
      {
        role: "system",
        content: "당신은 프로젝트 위험 분석 전문가입니다. 작업의 마감일 위험을 평가하고 대응 방안을 제시해주세요.",
      },
      {
        role: "user",
        content: `다음 작업들의 마감일 위험을 분석하고 각 작업에 대한 위험 이유와 대응 방안을 제시해주세요:
        ${JSON.stringify(riskTasks, null, 2)}
        
        각 작업에 대해 다음 형식으로 응답해주세요:
        1. 작업 ID: [taskId]
        2. 위험 이유: [위험한 이유 간략히 설명]
        3. 대응 방안: [구체적인 제안]`,
      },
    ]

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    )

    const aiResponse = response.data.choices[0].message.content

    // AI 응답 파싱
    const analysisResults = parseAIResponse(aiResponse, riskTasks)

    // 최종 결과 반환
    return res.json({
      riskTasks: analysisResults,
    })
  } catch (error) {
    console.error("마감일 위험 예측 오류:", error)
    return res.status(500).json({ error: "마감일 위험 예측 중 오류가 발생했습니다." })
  }
})

// 작업 최적화 제안
router.post("/task-optimization", async (req, res) => {
  try {
    const { tasks, userId } = req.body

    if (tasks.length === 0) {
      return res.json({
        analysis: ["분석할 작업이 없습니다."],
        suggestions: ["새로운 작업을 추가해보세요."],
        automation: "자동화할 작업이 없습니다.",
      })
    }

    // OpenAI API를 사용하여 작업 최적화 제안 생성
    const messages = [
      {
        role: "system",
        content: "당신은 작업 최적화 전문가입니다. 사용자의 작업을 분석하여 최적화 방안을 제시해주세요.",
      },
      {
        role: "user",
        content: `다음 작업 목록을 분석하여 최적화 방안을 제시해주세요:
        ${JSON.stringify(tasks, null, 2)}
        
        다음 형식으로 응답해주세요:
        1. 작업 분석: (현재 작업의 문제점 3가지)
        2. 최적화 방안: (3가지 구체적인 제안)
        3. 자동화 가능성: (이 작업들이 자동화될 수 있는지, 어떻게 자동화할 수 있는지)`,
      },
    ]

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    )

    const aiResponse = response.data.choices[0].message.content

    // AI 응답 파싱
    const analysisMatch = aiResponse.match(/작업 분석:(.*?)최적화 방안:/s)
    const suggestionsMatch = aiResponse.match(/최적화 방안:(.*?)자동화 가능성:/s)
    const automationMatch = aiResponse.match(/자동화 가능성:(.*?)$/s)

    const analysis = analysisMatch
      ? analysisMatch[1]
          .trim()
          .split(/\d+\.\s+/)
          .filter((item) => item.trim())
      : ["분석 정보를 가져오지 못했습니다."]

    const suggestions = suggestionsMatch
      ? suggestionsMatch[1]
          .trim()
          .split(/\d+\.\s+/)
          .filter((item) => item.trim())
      : ["제안 정보를 가져오지 못했습니다."]

    const automation = automationMatch ? automationMatch[1].trim() : "자동화 정보를 가져오지 못했습니다."

    return res.json({
      analysis,
      suggestions,
      automation,
    })
  } catch (error) {
    console.error("작업 최적화 제안 오류:", error)
    return res.status(500).json({ error: "작업 최적화 제안 중 오류가 발생했습니다." })
  }
})

// 최적 일정 제안
router.post("/optimal-schedule", async (req, res) => {
  try {
    const { tasks, userId } = req.body

    if (tasks.length === 0) {
      return res.json({
        peakTimes: [],
        optimalDays: [],
        recommendedSchedule: [],
      })
    }

    // 완료된 작업 분석
    const completedTasks = tasks.filter((task) => task.status === "DONE")

    // 시간대별 완료 작업 수 분석
    const hourCounts = {}
    completedTasks.forEach((task) => {
      if (task.completedAt) {
        const hour = new Date(task.completedAt).getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      }
    })

    // 요일별 완료 작업 수 분석
    const dayCounts = {}
    completedTasks.forEach((task) => {
      if (task.completedAt) {
        const day = new Date(task.completedAt).getDay()
        dayCounts[day] = (dayCounts[day] || 0) + 1
      }
    })

    // 생산성 피크 시간 계산
    const peakTimes = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count, score: Math.round((count / completedTasks.length) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    // 최적 작업일 계산
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
    const optimalDays = Object.entries(dayCounts)
      .map(([day, count]) => ({
        day: dayNames[day],
        count,
        completionRate: Math.round((count / completedTasks.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    // 미완료 작업
    const pendingTasks = tasks.filter((task) => task.status !== "DONE")

    if (pendingTasks.length === 0 || peakTimes.length === 0) {
      return res.json({
        peakTimes: peakTimes || [],
        optimalDays: optimalDays || [],
        recommendedSchedule: [],
      })
    }

    // OpenAI API를 사용하여 최적 일정 제안 생성
    const messages = [
      {
        role: "system",
        content: "당신은 생산성 최적화 전문가입니다. 사용자의 생산성 패턴을 분석하여 최적의 일정을 제안해주세요.",
      },
      {
        role: "user",
        content: `다음 정보를 바탕으로 사용자의 최적 일정을 제안해주세요:
        
        생산성 피크 시간대: ${JSON.stringify(peakTimes)}
        최적 작업일: ${JSON.stringify(optimalDays)}
        미완료 작업: ${JSON.stringify(pendingTasks)}
        
        각 작업을 사용자의 생산성이 가장 높은 시간대에 배치하는 일정을 제안해주세요.
        다음 형식으로 응답해주세요:
        1. 시간: [시간], 작업: [작업명]
        2. 시간: [시간], 작업: [작업명]
        ...`,
      },
    ]

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    )

    const aiResponse = response.data.choices[0].message.content

    // AI 응답 파싱
    const scheduleItems = aiResponse
      .split("\n")
      .filter((line) => line.match(/\d+\.\s+시간:/))
      .map((line) => {
        const timeMatch = line.match(/시간:\s+([^,]+)/)
        const taskMatch = line.match(/작업:\s+(.+)$/)

        return {
          time: timeMatch ? timeMatch[1].trim() : "",
          task: taskMatch ? taskMatch[1].trim() : "",
        }
      })

    return res.json({
      peakTimes,
      optimalDays,
      recommendedSchedule: scheduleItems,
    })
  } catch (error) {
    console.error("최적 일정 제안 오류:", error)
    return res.status(500).json({ error: "최적 일정 제안 중 오류가 발생했습니다." })
  }
})

// 생산성 향상 기회
router.post("/productivity-opportunity", async (req, res) => {
  try {
    const { tasks, userId } = req.body

    if (tasks.length === 0) {
      return res.json({
        currentPattern: "분석할 작업이 없습니다.",
        opportunities: ["새로운 작업을 추가해보세요."],
        expectedImpact: {
          productivityIncrease: "0%",
          timeSaved: "0시간/주",
        },
      })
    }

    // OpenAI API를 사용하여 생산성 향상 기회 분석
    const messages = [
      {
        role: "system",
        content: "당신은 생산성 향상 전문가입니다. 사용자의 작업 패턴을 분석하여 생산성 향상 기회를 제시해주세요.",
      },
      {
        role: "user",
        content: `다음 작업 데이터를 분석하여 생산성 향상 기회를 제시해주세요:
        ${JSON.stringify(tasks, null, 2)}
        
        다음 형식으로 응답해주세요:
        1. 현재 생산성 패턴: (현재 작업 패턴 분석)
        2. 개선 기회: (3가지 구체적인 제안)
        3. 예상 효과: (생산성 향상 정도, 시간 절약 정도)`,
      },
    ]

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    )

    const aiResponse = response.data.choices[0].message.content

    // AI 응답 파싱
    const patternMatch = aiResponse.match(/현재 생산성 패턴:(.*?)개선 기회:/s)
    const opportunitiesMatch = aiResponse.match(/개선 기회:(.*?)예상 효과:/s)
    const impactMatch = aiResponse.match(/예상 효과:(.*?)$/s)

    const currentPattern = patternMatch ? patternMatch[1].trim() : "생산성 패턴을 분석하지 못했습니다."

    const opportunities = opportunitiesMatch
      ? opportunitiesMatch[1]
          .trim()
          .split(/\d+\.\s+/)
          .filter((item) => item.trim())
      : ["개선 기회를 찾지 못했습니다."]

    const impactText = impactMatch ? impactMatch[1].trim() : ""

    // 예상 효과에서 생산성 향상과 시간 절약 추출
    const productivityMatch = impactText.match(/생산성.*?(\d+[%\s])/i)
    const timeMatch = impactText.match(/(\d+\s*시간)/i)

    const expectedImpact = {
      productivityIncrease: productivityMatch ? productivityMatch[1].trim() : "10-15%",
      timeSaved: timeMatch ? timeMatch[1].trim() : "2-3시간/주",
    }

    return res.json({
      currentPattern,
      opportunities,
      expectedImpact,
    })
  } catch (error) {
    console.error("생산성 향상 기회 분석 오류:", error)
    return res.status(500).json({ error: "생산성 향상 기회 분석 중 오류가 발생했습니다." })
  }
})

// AI 응답 파싱 유틸리티 함수
function parseAIResponse(aiResponse, riskTasks) {
  const taskAnalyses = []

  // 각 작업에 대한 분석 결과 추출
  riskTasks.forEach((task) => {
    const taskId = task.taskId
    const taskRegex = new RegExp(
      `작업 ID:\\s*${taskId}[\\s\\S]*?위험 이유:\\s*([\\s\\S]*?)대응 방안:\\s*([\\s\\S]*?)(?=작업 ID:|$)`,
      "i",
    )
    const match = aiResponse.match(taskRegex)

    if (match) {
      const riskReason = match[1].trim()
      const suggestion = match[2].trim()

      taskAnalyses.push({
        taskId,
        title: task.title,
        dueDate: task.dueDate,
        status: task.status,
        riskLevel: task.riskLevel,
        riskReason,
        suggestion,
      })
    } else {
      // AI가 분석하지 못한 경우 기본 정보만 포함
      taskAnalyses.push({
        taskId,
        title: task.title,
        dueDate: task.dueDate,
        status: task.status,
        riskLevel: task.riskLevel,
        riskReason: task.daysLeft < 0 ? "이미 마감일이 지났습니다." : `마감일까지 ${task.daysLeft}일 남았습니다.`,
        suggestion: "우선순위를 높이고 가능한 빨리 작업을 완료하세요.",
      })
    }
  })

  return taskAnalyses
}

module.exports = router

