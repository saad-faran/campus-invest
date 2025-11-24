# HuggingFace API Setup Guide

## Token Permissions Issue

Based on the errors you're seeing, your HuggingFace API token might need **"Write" permissions** instead of just "Read" permissions.

### Steps to Fix:

1. **Go to HuggingFace Token Settings:**
   - Visit: https://huggingface.co/settings/tokens
   - Or create new: https://huggingface.co/settings/tokens/new

2. **Create a New Token with Write Permissions:**
   - Click "New token"
   - Name: `campus-invest-api` (or any name you prefer)
   - **Role: Select "Write"** (not "Read")
   - Click "Create token"

3. **Update Your API Key:**
   - Copy the new token
   - Update it in `api-server.js` (line 15) or set it as environment variable:
     ```bash
     export HF_API_KEY="your_new_token_here"
     ```

4. **Restart Your Server:**
   ```bash
   npm run dev:full
   ```

## Why Write Permissions?

The HuggingFace Inference API sometimes requires Write permissions even for inference calls, especially with the new router endpoint. This is a security measure by HuggingFace.

## Alternative: Use a Different AI Service

If HuggingFace continues to have issues, we can switch to:
- OpenAI API (requires paid account)
- Anthropic Claude API (requires paid account)
- Google Gemini API (has free tier)
- Local AI models (requires more setup)

Let me know if you'd like to explore any of these alternatives!

