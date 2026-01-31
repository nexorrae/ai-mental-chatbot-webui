# AI Mental Chatbot WebUI (Frontend)

The frontend interface for the AI Mental Health Chatbot, providing a responsive and accessible chat experience.

## 🛠 Tech Stack
- **Framework:** [React 19](https://react.dev/)
- **Language:** TypeScript
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** CSS (Modular/Global)

## 🚀 Features
- **Real-time Chat:** Interactive chat interface with the backend.
- **Markdown Support:** Renders AI responses with proper formatting.
- **Responsive Design:** Optimized for desktop and mobile viewports.

## 📦 Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

## ⚙️ Configuration
Copy the `.env.example` file to `.env` and configure:

```bash
cp .env.example .env
```

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `FRONTEND_PORT` | Port for the dev server | `3001` |
| `VITE_API_URL` | URL of the backend API | `http://localhost:3000` |

> **Note:** `VITE_API_URL` must point to your running SDK instance.

## 🏃‍♂️ Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3001` (or the port shown in terminal).

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## 🐳 Docker Support
The application is container-ready. 

```bash
docker build -t mental-chatbot-webui .
docker run -p 3001:80 --env-file .env mental-chatbot-webui
```
*(Note: Dockerfile configuration typically serves static assets via Nginx).*

## 🧭 Frontend Role in Curhatin Workflow

The WebUI serves as the primary user interaction layer in Curhatin.

Responsibilities:
- Collect user input in a safe and accessible manner
- Display AI-generated responses clearly and transparently
- Act as a thin client without storing sensitive data
- Forward messages to the backend API for processing

The frontend does NOT:
- Perform AI inference
- Store conversation history permanently
- Make clinical or diagnostic decisions

## 🔐 Privacy & Data Handling (Frontend)

To respect user privacy and ethical boundaries:

- No personal identity (name, email, phone) is required to use the chat
- Messages are sent directly to the backend API and not persisted on the client
- Local storage is avoided for chat content unless explicitly enabled for UX purposes
- The frontend does not log or analyze user messages

All sensitive processing is delegated to the backend with anonymization policies.

## ⚠️ Ethical Disclaimer

Curhatin is a non-clinical AI companion designed for reflective and supportive conversations.

The frontend must clearly communicate that:
- This chatbot is NOT a mental health professional
- Responses are not medical, psychological, or psychiatric advice
- Users experiencing emergencies should seek professional help

This disclaimer should be visible in the UI (e.g., footer, onboarding modal, or info section).

## 🧠 AI Transparency

To ensure responsible AI use:

- The UI should indicate that responses are AI-generated
- The chatbot tone must remain supportive, neutral, and non-judgmental
- The frontend should avoid presenting responses as absolute truths

Any future AI-powered premium features must include clear user consent.


