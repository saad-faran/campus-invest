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
                text: `Convert this FYP abstract into a startup concept for the Pakistani market. Use simple language with specific numbers.

CRITICAL: Focus on Pakistani market context. Use PKR (Pakistani Rupees) for all pricing and financial figures. Consider local market conditions, typical Pakistani startup funding ranges (PKR 100K-500K for early stage), and realistic pricing for Pakistani consumers.

Include:
1. One-Line Pitch (for Pakistani market)
2. Problem (2-3 bullets with numbers, relevant to Pakistan)
3. Solution (2-3 bullets)
4. Target Market (numbers: customers, market size in Pakistan - use PKR for market size)
5. Revenue Model (pricing in PKR, projections in PKR)
6. MVP Features (3 features)
7. 3-Month Launch Plan (week-by-week milestones)

Format: Clean text, no markdown. Be concise. Use numbers. Always use PKR for currency.

Example pricing context:
- Pakistani consumers: PKR 500-2,000/month subscriptions are typical
- Early-stage funding: PKR 100K-500K is realistic
- Market size: Use PKR (e.g., PKR 10M market, not $10M)

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
