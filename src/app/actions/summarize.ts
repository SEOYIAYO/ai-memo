'use server'

// gemini-2.5-flash-lite는 신규 사용자에게 제공되지 않아(404) 3.1 Flash-Lite를 기본값으로 사용 (GEMINI_MODEL로 변경 가능)
const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite'
const MAX_CONTENT_LENGTH = 10000

const SYSTEM_PROMPT =
  '너는 메모 요약 도우미다. 사용자가 보낸 메모를 한국어로 3문장 이내의 짧은 문단으로 요약해라. 요약문만 출력하고 다른 설명은 덧붙이지 마라.'

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[]
}

export type SummarizeResult = { summary: string } | { error: string }

export async function summarizeMemoAction(
  content: string
): Promise<SummarizeResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { error: '서버에 API 키가 설정되지 않았습니다.' }
  }

  if (typeof content !== 'string' || content.trim().length === 0) {
    return { error: '요약할 내용이 없습니다.' }
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return {
      error: `메모가 너무 깁니다. ${MAX_CONTENT_LENGTH.toLocaleString('ko-KR')}자 이하만 요약할 수 있습니다.`,
    }
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: content }] }],
      }),
    })

    if (!response.ok) {
      console.error('Gemini API error:', response.status)
      return {
        error: 'AI 요약 요청에 실패했습니다. 잠시 후 다시 시도해주세요.',
      }
    }

    const data: GeminiResponse = await response.json()
    const summary = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text ?? '')
      .join('')
      .trim()

    if (!summary) {
      return { error: '요약 결과를 받지 못했습니다.' }
    }

    return { summary }
  } catch (error) {
    console.error('Summarize request failed:', error)
    return { error: 'AI 요약 중 오류가 발생했습니다.' }
  }
}
