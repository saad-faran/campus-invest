# 🚀 Deployment Guide - Campus Invest

## ✅ Step 1: Push to GitHub

Your code is committed and ready. You need to authenticate and push:

### Option A: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not installed
brew install gh

# Authenticate
gh auth login

# Push to GitHub
git push -u origin main
```

### Option B: Using Personal Access Token
```bash
# Generate a token at: https://github.com/settings/tokens
# Select: repo (all permissions)

# Push with token
git push https://YOUR_TOKEN@github.com/saad-faran/campus-invest.git main
```

### Option C: Using SSH (If you have SSH keys set up)
```bash
# Change remote to SSH
git remote set-url origin git@github.com:saad-faran/campus-invest.git

# Push
git push -u origin main
```

---

## ✅ Step 2: Deploy to Vercel

### 2.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose **"saad-faran/campus-invest"**
5. Click **"Import"**

### 2.2 Configure Project Settings

Vercel should auto-detect:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

✅ **Verify these settings are correct**

### 2.3 Add Environment Variables

**CRITICAL**: This is required for AI features to work!

1. In Vercel project settings, go to **"Environment Variables"**
2. Click **"Add New"**
3. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key (get from https://aistudio.google.com/app/apikey)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **"Save"**

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for build to complete
3. Your site will be live at: `https://campus-invest.vercel.app`

---

## ✅ Step 3: Verify Deployment

### Check These:

1. **Homepage loads**: https://campus-invest.vercel.app
2. **AI Tools visible**: Scroll to see FYP Transformer and Funding Calculator
3. **API endpoints work**: 
   - Test FYP Transformer with a sample abstract
   - Test Funding Calculator with sample inputs
4. **No errors in console**: Check browser DevTools

### If AI Features Don't Work:

1. Check Vercel logs: Project → Deployments → Click latest → View Function Logs
2. Verify `GEMINI_API_KEY` is set correctly
3. Check API route files exist in `/api` folder
4. Ensure API key has proper permissions

---

## 📋 Pre-Deployment Checklist

- [x] Code committed to GitHub
- [x] `.env.local` is NOT in repository (check .gitignore)
- [x] `GEMINI_API_KEY` is NOT hardcoded in files
- [x] API routes exist in `/api` folder
- [x] `vercel.json` is configured correctly
- [x] Build command works locally (`npm run build`)
- [ ] GitHub repository is pushed
- [ ] Vercel project is connected
- [ ] Environment variables are set
- [ ] Deployment is successful
- [ ] AI features are working

---

## 🔧 Troubleshooting

### Build Fails

**Error**: "Module not found"
- **Solution**: Run `npm install` locally, commit `package-lock.json`

**Error**: "API route not found"
- **Solution**: Ensure files are in `/api` folder, not `/api-server.js`

### AI Features Don't Work

**Error**: "GEMINI_API_KEY is not set"
- **Solution**: Add environment variable in Vercel dashboard

**Error**: "API returned 401"
- **Solution**: Check API key is valid and has proper permissions

**Error**: "Function timeout"
- **Solution**: Vercel free tier has 10s timeout. Our optimized AI calls are 3-5s, should work fine.

### Deployment Issues

**Error**: "Framework not detected"
- **Solution**: Manually set Framework Preset to "Vite"

**Error**: "Build output not found"
- **Solution**: Verify Output Directory is set to `dist`

---

## 📝 Important Notes

1. **API Server**: `api-server.js` is for local development only. Vercel uses `/api` folder automatically.

2. **Environment Variables**: Never commit API keys. Always use Vercel's environment variables.

3. **Automatic Deployments**: Every push to `main` branch triggers automatic deployment.

4. **Custom Domain**: You can add a custom domain in Vercel project settings.

5. **Analytics**: Enable Vercel Analytics in project settings to track usage.

---

## 🎉 Success!

Once deployed, your site will be:
- ✅ Live at `https://campus-invest.vercel.app`
- ✅ Automatically updated on every git push
- ✅ AI features fully functional
- ✅ Ready for hackathon submission!

---

## 📞 Need Help?

- Check Vercel logs for errors
- Review GitHub Actions (if enabled)
- Contact: hello@campusinvest.pk

