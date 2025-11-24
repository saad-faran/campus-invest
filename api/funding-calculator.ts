import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startupIdea, expectedUsers, teamSize } = req.body;

  if (!startupIdea || !expectedUsers) {
    return res.status(400).json({ error: "Missing required fields: startupIdea and expectedUsers" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const prompt = `Calculate lean, realistic funding ask for Pakistani startup.

Input:
- Idea: ${startupIdea}
- Users: ${expectedUsers}
${teamSize ? `- Team: ${teamSize}` : ""}

CRITICAL: Be LEAN and REALISTIC. Typical early-stage Pakistani startups raise PKR 100K-500K. Avoid exaggeration.

Provide:
1. Recommended Amount (PKR, justify why lean)
2. Cost Breakdown (PKR and %):
   • Tech/Dev
   • Marketing
   • Operations
   ${teamSize ? "• Team/Salaries" : ""}
3. 3-Month Burn (PKR/month)
4. Valuation (PKR, conservative)
5. Use of Funds (months 1-3)

Format: Clean text, no markdown. Be concise. Use realistic PKR amounts.

Example (lean):
Amount: PKR 200,000
Tech: PKR 80,000 (40%)
Marketing: PKR 60,000 (30%)
Ops: PKR 40,000 (20%)
Team: PKR 20,000 (10%)
Burn: PKR 66,667/month`;

    // Use fastest model only
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    console.log(`[Funding Calculator] Using gemini-2.5-flash (fastest model)...`);
    
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
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    console.log(`[Funding Calculator] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("No text in response");
    }

    const output = data.candidates[0].content.parts[0].text;

    console.log(`✅ [Funding Calculator] Success! Generated text length: ${output.length}`);
    return res.status(200).json({ text: output });
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    
    // Lean calculation: base amount + smaller per-user multiplier, capped at reasonable max
    const baseAmount = 100000; // PKR 100K base
    const perUserAmount = Math.min(parseInt(expectedUsers) * 50, 200000); // Max PKR 200K from users
    const totalAmount = Math.min(baseAmount + perUserAmount, 500000); // Cap at PKR 500K
    
    const techAmount = Math.round(totalAmount * 0.4);
    const marketingAmount = Math.round(totalAmount * 0.3);
    const opsAmount = Math.round(totalAmount * 0.2);
    const teamAmount = teamSize ? Math.round(totalAmount * 0.1) : 0;
    const monthlyBurn = Math.round(totalAmount / 3);
    const valuation = Math.round(totalAmount * 3); // Conservative 3x multiple
    
    const fallbackResponse = `FUNDING ASK CALCULATOR REPORT

Recommended Fundraising Amount: PKR ${totalAmount.toLocaleString()}
Lean approach: Focus on MVP and initial traction with ${expectedUsers} users.

Cost Breakdown:
• Technology/Development: PKR ${techAmount.toLocaleString()} (40%)
• Marketing & Growth: PKR ${marketingAmount.toLocaleString()} (30%)
• Operations & Overhead: PKR ${opsAmount.toLocaleString()} (20%)
${teamSize ? `• Team & Salaries: PKR ${teamAmount.toLocaleString()} (10%)` : ""}

3-Month Burn Rate: PKR ${monthlyBurn.toLocaleString()}/month

Valuation Suggestion: PKR ${valuation.toLocaleString()} (pre-money)
Conservative estimate based on early-stage Pakistani startup benchmarks.

Use of Funds Timeline:
• Month 1: Technology setup (40%), Initial marketing (20%)
• Month 2: Development continuation (30%), Marketing ramp-up (30%)
• Month 3: Operations scaling (20%), Growth marketing (40%)

Note: This is a template response. For AI-generated analysis, please configure the Gemini API key.`;

    return res.status(200).json({ 
      text: fallbackResponse,
      note: "Note: This is a template-based response. The AI API encountered an error: " + errorMessage
    });
  }
}

