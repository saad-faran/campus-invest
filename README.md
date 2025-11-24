# 🚀 Campus Invest - AI-Powered University Micro-Investment Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://campus-invest.vercel.app)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB)](https://reactjs.org/)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4)](https://ai.google.dev/)

**Pakistan's first university-centered micro-investment platform** empowering student entrepreneurs through AI-powered tools and community-driven funding.

---

## 🎯 Project Overview

Campus Invest bridges the gap between student innovation and early-stage funding. We connect verified university students, alumni, and faculty to fund promising startups and final-year projects (FYPs) with micro-investments starting from just **PKR 100**.

### Key Features

- 🏛️ **University-Verified Startups**: Only verified students from partner universities can list
- 💰 **Micro-Investments**: Start investing from PKR 100 - democratizing access to startup funding
- 📊 **Transparent Tracking**: Real-time progress updates and funding dashboards
- 🤝 **Community-Driven**: Alumni, students, and faculty invest in their university's innovation
- 🎓 **FYP Support**: Final-year projects can raise funding before becoming full startups

---

## ✨ **Core GenAI Features** (Hackathon Highlights)

### 1. 🤖 **FYP → Startup Transformer (AI-Powered)**

Transform your final-year project abstract into a comprehensive startup concept in seconds using Google Gemini AI.

**Features:**
- **Input**: Paste your FYP abstract
- **AI Processing**: Analyzes your project and generates a complete business plan
- **Output**: 
  - One-line pitch
  - Problem statement with data
  - Solution architecture
  - Target market analysis with numbers
  - Revenue model with pricing
  - MVP feature roadmap
  - 3-month launch plan with milestones
- **Export Options**: Download as PDF or TXT
- **Speed**: ⚡ Ultra-fast response (3-5 seconds)

**Tech Stack:**
- Google Gemini 2.5 Flash API
- React + TypeScript
- jsPDF for document generation
- Vercel Serverless Functions

**Use Case:**
Students can instantly convert their academic projects into investor-ready startup concepts, saving weeks of business plan development.

---

### 2. 💵 **AI Funding Ask Calculator**

Calculate the perfect funding amount with AI-powered analysis and justification.

**Features:**
- **Input**: 
  - Startup idea description
  - Expected number of users
  - Team size (optional)
- **AI Analysis**: Generates lean, realistic funding recommendations
- **Output**:
  - Recommended fundraising amount (PKR) with justification
  - Detailed cost breakdown:
    - Technology/Development (40%)
    - Marketing & Growth (30%)
    - Operations & Overhead (20%)
    - Team & Salaries (10%)
  - 3-month burn rate calculation
  - Pre-money valuation suggestion
  - Use of funds timeline (month-by-month)
- **Export Options**: Download as PDF or TXT
- **Speed**: ⚡ Ultra-fast response (3-5 seconds)

**Tech Stack:**
- Google Gemini 2.5 Flash API
- React + TypeScript
- jsPDF for document generation
- Vercel Serverless Functions

**Use Case:**
First-time founders who don't know how much to ask for can get data-driven, realistic funding recommendations tailored to Pakistani startup costs.

---

## 🏆 Hackathon Evaluation Highlights

### Innovation & AI Integration

1. **Real-World Problem Solving**: Addresses the critical gap where 80% of student projects are abandoned due to lack of funding
2. **AI-Powered Automation**: Reduces weeks of work to seconds for business plan creation and funding calculations
3. **Accessibility**: Makes startup planning accessible to students without business background
4. **Data-Driven Decisions**: Provides specific numbers, metrics, and realistic projections

### Technical Excellence

- **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Serverless Architecture**: Vercel serverless functions for scalable AI API calls
- **Optimized Performance**: 
  - Fast AI responses (3-5 seconds)
  - Single model approach (Gemini 2.5 Flash)
  - Optimized prompts for speed
- **Production-Ready**: Full error handling, fallback responses, PDF generation

### User Experience

- **Intuitive Interface**: Clean, modern UI with smooth animations
- **Multiple Entry Points**: Hero banner, floating button, direct navigation
- **Export Capabilities**: Professional PDF and TXT downloads
- **Responsive Design**: Works seamlessly on all devices

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Backend & AI
- **API**: Vercel Serverless Functions
- **AI Model**: Google Gemini 2.5 Flash
- **API Routes**: 
  - `/api/transform` - FYP Transformer
  - `/api/funding-calculator` - Funding Calculator

### Deployment
- **Platform**: Vercel
- **CI/CD**: Automatic deployments from GitHub
- **Environment**: Serverless functions with edge optimization

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/saad-faran/campus-invest.git
cd campus-invest
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run development server**
```bash
# For frontend only
npm run dev

# For frontend + local API server (full setup)
npm run dev:full
```

5. **Open in browser**
- Frontend: http://localhost:8080
- API Server: http://localhost:3001

### Production Build

```bash
npm run build
npm run preview
```

---

## 🚀 Deployment

### Vercel Deployment

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import `saad-faran/campus-invest` repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key_here`
   - Save and redeploy

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://campus-invest.vercel.app`

### Important Notes

- ✅ API routes in `/api` folder are automatically deployed as serverless functions
- ✅ `api-server.js` is for local development only (not needed in production)
- ✅ Environment variables are securely stored in Vercel dashboard
- ✅ Automatic deployments on every push to `main` branch

---

## 📁 Project Structure

```
campus-invest/
├── api/                          # Vercel serverless functions
│   ├── transform.ts              # FYP Transformer API
│   └── funding-calculator.ts     # Funding Calculator API
├── src/
│   ├── components/               # React components
│   │   ├── FYPTransformer.tsx     # AI FYP Transformer UI
│   │   ├── FundingCalculator.tsx # AI Funding Calculator UI
│   │   ├── AIToolsFloatingButton.tsx
│   │   └── ...
│   ├── pages/                    # Page components
│   └── assets/                   # Images and static files
├── pages/                        # Static HTML pages
│   └── pages/                    # Additional pages
├── vercel.json                   # Vercel configuration
├── vite.config.ts                # Vite configuration
└── package.json                   # Dependencies
```

---

## 🎨 Key Features

### For Founders
- ✅ Register your startup with university verification
- ✅ Set funding goals and milestones
- ✅ Track investor contributions
- ✅ Provide progress updates
- ✅ **AI-Powered**: Transform FYP to startup concept
- ✅ **AI-Powered**: Calculate optimal funding ask

### For Investors
- ✅ Browse verified university startups
- ✅ Micro-invest starting from PKR 100
- ✅ Track portfolio performance
- ✅ Support your alma mater's innovation
- ✅ Transparent progress tracking

### For Universities
- ✅ Innovation dashboard
- ✅ Startup tracking & analytics
- ✅ Alumni engagement metrics
- ✅ Inter-campus leaderboards

---

## 🔐 Security & Privacy

- ✅ University verification required for all founders
- ✅ Secure API key management via environment variables
- ✅ No sensitive data stored in codebase
- ✅ HTTPS enforced on all deployments
- ✅ Input validation and sanitization

---

## 📊 API Documentation

### FYP Transformer API

**Endpoint**: `POST /api/transform`

**Request Body**:
```json
{
  "abstract": "Your final year project abstract here..."
}
```

**Response**:
```json
{
  "text": "Generated startup concept plan..."
}
```

### Funding Calculator API

**Endpoint**: `POST /api/funding-calculator`

**Request Body**:
```json
{
  "startupIdea": "Description of your startup idea",
  "expectedUsers": 1000,
  "teamSize": 3
}
```

**Response**:
```json
{
  "text": "Funding recommendation with breakdown..."
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

- **Saad Faran** - Founder & CEO (NUST)
- **Muhammad Arhum** - Team Member (UCP)
- **Fizza Afzal** - Team Member (UCP)
- **Dr. Naila Amir** - Advisor (NUST)
- **Zurriat Fatima** - Advisor (COMSATS)

---

## 📧 Contact

- **Email**: hello@campusinvest.pk
- **GitHub**: [@saad-faran](https://github.com/saad-faran)
- **LinkedIn**: [Saad Faran](https://www.linkedin.com/in/saad-faran/)

---

## 🙏 Acknowledgments

- Google Gemini AI for powering our intelligent features
- Vercel for seamless deployment
- All partner universities for their support
- The student entrepreneur community

---

## 🎯 Future Roadmap

- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced AI features (pitch deck generator, market analysis)
- [ ] Integration with payment gateways
- [ ] Alumni mentorship matching
- [ ] Cross-university investment features

---

**Built with ❤️ for Pakistan's student entrepreneurs**
