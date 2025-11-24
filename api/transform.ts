import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { abstract } = req.body;

  if (!abstract) {
    return res.status(400).json({ error: "Missing abstract" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    // Use fastest model only (gemini-2.5-flash)
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    console.log(`[FYP Transformer] Using gemini-2.5-flash (fastest model)...`);
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Convert this FYP abstract into a startup concept. Use simple language with specific numbers.

Include:
1. One-Line Pitch
2. Problem (2-3 bullets with numbers)
3. Solution (2-3 bullets)
4. Target Market (numbers: customers, market size)
5. Revenue Model (pricing, projections)
6. MVP Features (3 features)
7. 3-Month Launch Plan (week-by-week milestones)

Format: Clean text, no markdown. Be concise. Use numbers.

Abstract: ${abstract}`
              }
            ],
          },
        ],
      }),
    });

    console.log(`[FYP Transformer] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("No text in response");
    }

    const output = data.candidates[0].content.parts[0].text;

    console.log(`✅ [FYP Transformer] Success! Generated text length: ${output.length}`);
    return res.status(200).json({ text: output });
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: "AI error", detail: errorMessage });
  }
}
