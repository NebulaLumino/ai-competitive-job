import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const { currentJobDesc, compJobListings } = input || {};
    if (!currentJobDesc?.trim()) {
      return NextResponse.json({ error: "Current job description is required" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert Talent Acquisition and Employer Branding specialist. Rewrite and optimize job descriptions to attract higher-quality candidates.\n\nProvide:\n1. REWRITTEN job description — compelling, specific, inclusive\n2. Key improvements made (bullet list)\n3. Compensation benchmark (based on market standards)\n4. Red flag warnings in the current description\n5. What top candidates will notice\n6. Suggested job title optimization (if applicable)\n7. Keyword optimization for candidate search\n\nMake it specific, results-oriented, and inclusive. Remove corporate boilerplate.`,
        },
        {
          role: "user",
          content: `Current job description:\n${currentJobDesc}\n\nCompeting listings (optional):\n${compJobListings || "Not provided"}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
