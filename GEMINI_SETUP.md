# Google Gemini API Setup

We've switched from HuggingFace to Google Gemini API for better reliability and a generous free tier.

## Get Your Free API Key

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy your API key

3. **Update Your Code:**

   **For Local Development:**
   - Open `api-server.js`
   - Find line 12: `const GEMINI_API_KEY = ...`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key
   
   **OR set as environment variable:**
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

   **For Vercel Deployment:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add: `GEMINI_API_KEY` with your API key value
   - Redeploy your project

## Free Tier Limits

- **60 requests per minute** (free tier)
- **1,500 requests per day** (free tier)
- More than enough for development and moderate usage!

## Test It

After adding your API key:

```bash
npm run dev:full
```

Then test the transformer on your landing page. It should now work with real AI-generated content!

## Why Gemini?

- ✅ Free tier with generous limits
- ✅ Reliable and fast
- ✅ Great for text generation tasks
- ✅ Easy to set up
- ✅ No complex authentication

