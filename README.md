

# 🛡️ [Anonymous Reporting App]([url](https:safetoreport.vercel.app))  

[A secure platform for anonymous incident reporting.]([url](https:safetoreport.vercel.app))
## 📋 Table of Contents  
- [🤖 Introduction](#-introduction)  
- [⚙️ Tech Stack](#-tech-stack)  
- [🔋 Features](#-features)  
- [🤸 Quick Start](#-quick-start)
- [🛢️DB Design](#db-design)
- [🕸️ Environment Setup](#-environment-setup)  
- [🚀 Deployment](#-deployment)

[LIVE](([url](https:safetoreport.vercel.app)))
---


---

## 🤖 Introduction  
This is a state-of-the-art **anonymous reporting system** built with **Next.js 14**, designed to provide a secure platform for reporting incidents while maintaining **complete anonymity**.

---

## ⚙️ Tech Stack  

- **Reactjs**  
- **Mongoose with MongoDB Database**  
- **Nodejs**
- **Expressjs**  
- **Tailwind CSS**  
- **React Hook Form**  
- **GeminiAI**
- **Cloudinary**
- **BCrypt for Password Encryption**  
-🔥 Tech Stack: MERN | Cloudinary | Gemini AI | Google Maps API | Tailwind CSS 🚀
---

## 🔋 Features  
- **Secure Anonymous Reporting:** Ensures privacy with robust encryption.  
- **Role-Based Access:** Admin and Police Stations panel for report management.
- **Nearest Police Station Detection:** Auto-fetches nearest station using lat/lng, with manual selection fallback.
- **Real-Time Updates:** Instantly see report status changes.  
- **User Authentication:** Powered by NextAuth.js.  
- **Responsive Design:** Optimized for mobile and desktop.  
- **AI-Powered Insights:** Integrated with GeminiAI for advanced reporting.  

---
![Image](https://github.com/user-attachments/assets/18fc51f2-e6b3-4457-9707-90afaf8c7515)

![Image](https://github.com/user-attachments/assets/832b618b-7313-4d11-b032-3650f75e4a0d)

![Image](https://github.com/user-attachments/assets/33e8ba23-bace-4b4b-bb30-342a43a066b0)

![Image](https://github.com/user-attachments/assets/0540fd65-c8e3-4819-9963-4eb36a4b4bc6)

![Image](https://github.com/user-attachments/assets/07a6ac89-bc58-4e81-9d61-dc4357c81806)

# DB Design
![Image](https://github.com/user-attachments/assets/eea273b0-9b7d-4471-95d4-e4c8d1730db1)
---
## 🤸 Quick Start  
### Prerequisites  
Make sure you have the following installed:  
- **Node.js**  
- **npm**  
- **Git**  

### Installation  
```bash
# Clone the repository
git clone <your-repo-url>
cd anonymous-reporting-system

# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev

 
 

```

## <a name="deployment">🚀 Deployment</a>

The application can be easily deployed on [Vercel](https://vercel.com):

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy!

---

## 🔧 Environment Variables (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URI` | ✅ | MongoDB Atlas SRV connection string |
| `MONGO_EXPLICIT_URI` | ⚠️ | Explicit-host fallback used when Node's SRV resolver fails (e.g. `querySrv ECONNREFUSED` on Windows) |
| `JWT_SECRET` | ✅ | Secret for signing auth tokens |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` | ✅ | SMTP config for all emails (`EMAIL_HOST`/`EMAIL_USER`/`EMAIL_PASS` still accepted as fallback) |
| `RESEND_API_KEY` / `RESEND_FROM` | ⚠️ | **Resend API fallback** — used automatically when SMTP fails (or as the only provider if SMTP isn't configured) |
| `FRONTEND_URL` | ⚠️ | Base URL for login / reset links (defaults to `https://safetoreport.vercel.app`) |
| `GEMINI_API_KEY` | ⚠️ | Primary AI provider (image/video analysis) |
| `OPENAI_API_KEY` | ⚠️ | Fallback AI provider — auto-used on Gemini rate-limit/quota/5xx (see `Brain.md` §4) |
| `AI_PRIMARY_PROVIDER` / `AI_FALLBACK_PROVIDER` | ❌ | Defaults: `gemini` / `openai` |
| `CLOUDINARY_*`, `FOLDER_NAME` | ✅ | Media uploads |

> Email vars are validated at startup (fail-fast). If emails fail, they are **logged and non-blocking** — report creation and police-station creation never break because of an email issue.

---

## 🔐 Password Reset / Account Emails

- `POST /api/auth/forgot-password` — accepts email, issues a **single-use, 1-hour** reset token (only its hash is stored), emails a secure reset link. Always returns the same message (no account enumeration).
- `POST /api/auth/reset-password` — verifies token, updates password, clears the token. Rate-limited.
- Admin-created police stations receive an **invite email** with a "Set Your Password" link (no plaintext passwords in email), plus the login URL.

## 🤖 AI Analysis (non-blocking fallback)

`backend/controllers/ai-adapter.js` wraps Gemini with a fallback to OpenAI:

1. Primary: Gemini. On rate-limit / quota / 5xx → immediately tries OpenAI.
2. Both unavailable → returns `{ aiFailed: true }` placeholder to the UI; analysis never blocks report submission (user can fill details manually).
3. Per-provider circuit breaker: 3 consecutive failures → skip that provider for 60s.
4. Prompts come from `backend/config/brainPrompts.js` (source of truth: `Brain.md`).

## 👁️ UI notes

- Login & reset-password forms have a password show/hide (eye) toggle.
- Header has a responsive profile dropdown (Profile / Settings / Logout) on desktop and mobile.

