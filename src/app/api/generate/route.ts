import { NextRequest, NextResponse } from "next/server";

function getClient() {
  const OpenAI = require("openai");
  return new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.DEEPSEEK_API_KEY });
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const { currentJobDesc, compJobListings } = input || {};
    if (!currentJobDesc?.trim()) return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    const client = getClient();
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: `You are an expert Talent Acquisition specialist. Rewrite and optimize job descriptions to attract higher-quality candidates.\n\nProvide: 1) REWRITTEN job description (compelling, specific, inclusive) 2) Key improvements made 3) Compensation benchmark 4) Red flag warnings 5) What top candidates will notice 6) Suggested job title optimization 7) Keyword optimization for candidate search.\n\nMake it specific, results-oriented, and inclusive. Remove corporate boilerplate.` },
        { role: "user", content: `Current job description:\n${currentJobDesc}\n\nCompeting listings (optional):\n${compJobListings || "Not provided"}` },
      ],
      temperature: 0.7, max_tokens: 2500,
    });
    return NextResponse.json({ result: response.choices[0]?.message?.content || "No result generated." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
