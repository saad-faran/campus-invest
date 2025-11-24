// Local API server for development
// This runs alongside Vite to handle API routes locally
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Google Gemini API Key - Get one for free at https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBam-_2ByWK7kxLp02ENdKFlu4hRFZETeQ";

app.post('/api/transform', async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { abstract } = req.body;

  if (!abstract) {
    return res.status(400).json({ error: "Missing abstract" });
  }

  const prompt = `
Convert this final year project abstract into a clear startup concept. Provide:

- One-line startup pitch
- Problem
- Solution
- Target customer
- Monetization model
- MVP roadmap (3 bullets)
- 3-month launch plan (month-by-month)

Abstract:

${abstract}
  `;

  try {
    // Use fastest model first (gemini-2.5-flash is fastest)
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
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
    
    // This should not be reached, but keep for safety
    throw new Error(`API call failed. Please check your Gemini API key.`);
    
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    
    // Fallback to template response if API fails
    console.log("Using fallback template response...");
    const fallbackResponse = generateFallbackResponse(abstract);
    
    return res.status(200).json({ 
      text: fallbackResponse,
      note: "Note: This is a template-based response. The AI API encountered an error: " + (err.message || "Unknown error") + ". Please check your Gemini API key and ensure the Gemini API is enabled in Google Cloud Console."
    });
  }
});

// Fallback function to generate a basic startup plan from the abstract
function generateFallbackResponse(abstract) {
  // Extract key information from the abstract
  const words = abstract.toLowerCase().split(/\s+/);
  const techKeywords = words.filter(w => 
    ['app', 'application', 'system', 'platform', 'software', 'mobile', 'web', 'iot', 'ai', 'machine learning', 'data'].includes(w)
  );
  
  const domain = techKeywords.length > 0 ? techKeywords[0] : 'technology';
  
  return `STARTUP CONCEPT PLAN

One-Line Pitch:
A ${domain} solution that turns your final year project into a real startup solving actual problems.

Problem:
• 80% of student projects are abandoned after graduation
• Students lack PKR 50,000-200,000 needed to continue development
• No clear path from academic project to market-ready product

Solution:
• Transform your FYP into a funded startup
• Get PKR 50,000-500,000 through micro-investments
• Launch in 3 months with MVP
• Reach 1,000+ users in first 6 months

Target Market:
• Primary: 10,000+ students and recent graduates in your university
• Secondary: 50,000+ students across 5 partner universities
• Market Size: PKR 10M+ potential market in first year
• Early Adopters: 100-500 users in first 3 months

Revenue Model:
• Subscription: PKR 500-2,000/month per user
• Freemium: Free basic, PKR 1,000/month premium
• One-time: PKR 5,000-10,000 lifetime license
• Projected Revenue: PKR 500K-2M in first year with 200-500 paying users

MVP Features:
• Core Feature 1: Launch in Week 1-2
• Core Feature 2: Launch in Week 3-4
• Core Feature 3: Launch in Week 5-6

3-Month Launch Plan:

Month 1 (Weeks 1-4):
• Week 1: Finalize MVP features, set up development environment
• Week 2: Build core functionality (40% complete)
• Week 3: Complete core features (80% complete)
• Week 4: Internal testing with 5-10 beta users

Month 2 (Weeks 5-8):
• Week 5: Fix critical bugs, improve UX
• Week 6: Expand to 20-30 beta users, collect feedback
• Week 7: Implement improvements, prepare marketing
• Week 8: Soft launch to 50-100 users

Month 3 (Weeks 9-12):
• Week 9: Public launch, target 200 users
• Week 10: Monitor usage, optimize performance
• Week 11: Add monetization features
• Week 12: Reach 500+ users, prepare for next funding round

Next Steps:
1. Register on Campus Invest
2. Set funding goal: PKR 100,000-300,000
3. Launch campaign and reach investors

Note: This is a template response. For AI-generated content, please configure the Gemini API key.`;
}

// Funding Calculator API endpoint
app.post('/api/funding-calculator', async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startupIdea, expectedUsers, teamSize } = req.body;

  if (!startupIdea || !expectedUsers) {
    return res.status(400).json({ error: "Missing required fields: startupIdea and expectedUsers" });
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

  try {
    // Use fastest model only
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
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
    console.error("Error calling Gemini API for funding calculator:", err);
    
    // Fallback response
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
      note: "Note: This is a template-based response. The AI API encountered an error: " + (err.message || "Unknown error")
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/transform`);
  console.log(`⚠️  Make sure to set GEMINI_API_KEY environment variable or update it in api-server.js`);
});
