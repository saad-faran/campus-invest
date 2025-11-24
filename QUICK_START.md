# ⚡ Quick Start - GitHub & Vercel Deployment

## ✅ What's Done

- ✅ All code committed locally
- ✅ README.md created with hackathon highlights
- ✅ .gitignore configured (no API keys will be committed)
- ✅ Vercel configuration ready
- ✅ API routes in `/api` folder (ready for Vercel)

## 🚀 Next Steps (You Need to Do)

### 1. Push to GitHub (Choose ONE method)

#### Method A: GitHub CLI (Easiest)
```bash
# Install GitHub CLI
brew install gh

# Login
gh auth login

# Push
cd /Users/saadfaran/Downloads/campus_invest_copy
git push -u origin main
```

#### Method B: Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: `repo` (all permissions)
4. Copy the token
5. Run:
```bash
cd /Users/saadfaran/Downloads/campus_invest_copy
git push https://YOUR_TOKEN@github.com/saad-faran/campus-invest.git main
```

#### Method C: GitHub Desktop
1. Open GitHub Desktop
2. Add repository: `/Users/saadfaran/Downloads/campus_invest_copy`
3. Click "Publish repository"
4. Repository name: `campus-invest`
5. Click "Publish repository"

### 2. Deploy to Vercel

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "Add New Project"
3. **Import**: `saad-faran/campus-invest`
4. **Configure**:
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
5. **Add Environment Variable**:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Get key: https://aistudio.google.com/app/apikey
6. **Click**: "Deploy"
7. **Wait**: 1-2 minutes
8. **Done!** Your site is live at: `https://campus-invest.vercel.app`

## ✅ Verification Checklist

After deployment, check:
- [ ] Homepage loads
- [ ] AI tools section visible
- [ ] FYP Transformer works (test with sample abstract)
- [ ] Funding Calculator works (test with sample inputs)
- [ ] No console errors

## 📝 Important

- **API Key**: Must be set in Vercel environment variables
- **Repository**: https://github.com/saad-faran/campus-invest
- **Live URL**: https://campus-invest.vercel.app (after deployment)

## 🆘 If Something Goes Wrong

1. Check Vercel deployment logs
2. Verify `GEMINI_API_KEY` is set
3. Check browser console for errors
4. See `DEPLOYMENT.md` for detailed troubleshooting

---

**You're all set! Just push to GitHub and deploy on Vercel! 🎉**

