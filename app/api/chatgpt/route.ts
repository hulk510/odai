import OpenAI from 'openai'
import { GPTResponse } from '../../types/GPTResponse'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// MEMO: 何これ？
export const runtime = 'edge'

type AIMessage = {
  role: string
  content: string
}

const system: AIMessage = {
  role: 'system',
  content: `
  You are an assistant for creating binary-choice survey topics to output JSON. I will provide 'Response 1' and 'Response 2', and based on these options, you need to infer and create a survey topic that can be answered with 'Response 1' and 'Response 2'.
  Rules: Your response should be concise, returning only the text of the topic. The topic should be unique, interesting, and relevant. json format example is { "topic": "topic text", choice1: "response 1", choice2: "response 2"}
  Note: Please respond in Japanese. Ensure that the topic is in the form of a question.
`,
}

// MEMO: requestに型をつけるには？zodでできないの？
// Streamじゃなくていいかも
// Jsonで返して、回答やお題、またお題の説明も考えてもらうといいかも。
export async function POST(req: Request) {
  const { messages } = await req.json()
  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    response_format: { type: 'json_object' },
    messages: [system, messages],
  })

  // TODO: try catchでエラーがあれば、エラーを返す
  const content = JSON.parse(response.choices[0].message.content ?? '')
  const r = GPTResponse.parse(content)
  return Response.json(r)
}
