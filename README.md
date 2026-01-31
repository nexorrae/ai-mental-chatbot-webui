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
