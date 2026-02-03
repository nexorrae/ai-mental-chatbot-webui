# CurhatIn WebUI (Frontend)

<div align="center">
  <h3>A Safe Space for Daily Reflection</h3>
  <p>The gentle, responsive, and privacy-focused interface for CurhatIn.</p>
</div>

---

## 📖 Overview

**CurhatIn WebUI** is the user-facing frontend for the CurhatIn platform. Built with **React 19** and **Vite**, it emphasizes a calming user experience with soft colors, smooth animations, and a focus on accessibility. It connects seamlessly to the CurhatIn SDK to provide a real-time, supportive chat experience.

## ✨ Features

- **🌗 Adaptive Theming**: Seamless Light and Dark mode with brand-aligned calming colors.
- **⚡ Real-time Interaction**: Fast, responsive chat interface with typing indicators.
- **📱 Fully Responsive**: Optimized experience across Desktop, Tablet, and Mobile.
- **📝 Markdown Support**: Rich text rendering for structured AI responses.
- **🔒 Privacy Design**: No user tracking, no PII collection, and ephemeral session handling.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS Modules / Custom Design System
- **Icons**: React Icons / Custom SVG

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ai-mental-chatbot-webui.git
    cd ai-mental-chatbot-webui
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Copy the example env file:
    ```bash
    cp .env.example .env
    ```
    Set your backend URL:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

### Development

Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Production Build

Build the app for production:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

## 🐳 Docker Deployment

The application is container-ready with Nginx serving static assets.

```bash
docker build -t curhatin-webui .
docker run -p 80:80 curhatin-webui
```

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components
├── pages/        # Route pages (Landing, Chat)
├── assets/       # Images and fonts
└── App.tsx       # Main application entry
```

## 🤝 Contributing

This project is open source. Please refer to `docs/FRONTEND_OVERVIEW.md` for historical context and design philosophy.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewLook`)
3.  Commit your Changes (`git commit -m 'Update UI'`)
4.  Push to the Branch (`git push origin feature/NewLook`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
