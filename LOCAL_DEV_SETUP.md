# Local Development Setup for AI Transformer

## Quick Start

To test the FYP → Startup Transformer locally with the AI API:

```bash
npm run dev:full
```

This will start:
- **API Server** on `http://localhost:3001` (handles `/api/transform`)
- **Vite Dev Server** on `http://localhost:8080` (your React app)

The Vite server is configured to proxy all `/api/*` requests to the local API server.

## Alternative: Run Servers Separately

If you prefer to run them in separate terminals:

**Terminal 1 - API Server:**
```bash
npm run dev:api
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

## Testing the Feature

1. Open `http://localhost:8080` in your browser
2. Scroll down to the "FYP → Startup Transformer" section
3. Paste a final-year project abstract in the textarea
4. Click "Transform with AI"
5. Wait for the AI to generate the startup plan
6. Download as PDF or TXT

## API Key

The HuggingFace API key is currently configured in `api-server.js`. For production, move it to environment variables:

1. Create a `.env` file in the root directory
2. Add: `HF_API_KEY=your_key_here`
3. Update `api-server.js` to use `process.env.HF_API_KEY` only

## Troubleshooting

- **API not responding**: Make sure the API server is running on port 3001
- **CORS errors**: The API server includes CORS middleware, but if issues persist, check the proxy configuration in `vite.config.ts`
- **AI errors**: Check the console for detailed error messages from the HuggingFace API

