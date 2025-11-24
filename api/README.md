# API Routes

This directory contains Vercel serverless functions.

## Local Development

For local development with API routes, you have two options:

### Option 1: Use Vercel CLI (Recommended)
```bash
npm run dev:vercel
```
This will start both the Vite dev server and the API routes locally.

### Option 2: Use Vite Dev Server Only
```bash
npm run dev
```
Note: API routes will only work on Vercel deployment. For local testing of API routes, use Option 1.

## Environment Variables

Make sure to set `HF_API_KEY` in your Vercel project settings:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add `HF_API_KEY` with your HuggingFace API key

## API Endpoints

### POST /api/transform
Transforms an FYP abstract into a startup concept using AI.

**Request Body:**
```json
{
  "abstract": "Your FYP abstract text here..."
}
```

**Response:**
```json
{
  "text": "Generated startup plan..."
}
```

