import { useState } from 'react'
import './App.css'
import ChatPage from './pages/ChatPage'

type Page = 'landing' | 'chat';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  if (currentPage === 'chat') {
    return <ChatPage onBack={() => setCurrentPage('landing')} />;
  }

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <a href="/" className="nav-logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">MindJournal</span>
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#privacy">Privacy</a>
          </div>
          <button onClick={() => setCurrentPage('chat')} className="btn btn-primary">Mulai Chat</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">🔒 Privacy-First Mental Wellness</span>
            <h1 className="hero-title">
              Your Safe Space for
              <span className="text-gradient"> Daily Reflection</span>
            </h1>
            <p className="hero-description">
              A mindful journaling companion that respects your privacy.
              Write freely, reflect deeply, and let AI gently guide your thoughts —
              only when you choose.
            </p>
            <div className="hero-buttons">
              <button onClick={() => setCurrentPage('chat')} className="btn btn-primary btn-lg">
                Mulai Chat Sekarang
                <span className="btn-arrow">→</span>
              </button>
              <a href="#how-it-works" className="btn btn-secondary btn-lg">
                Learn More
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Local Storage</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">Zero</span>
                <span className="stat-label">Data Tracking</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">Free</span>
                <span className="stat-label">Core Features</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <span className="card-date">Today</span>
                <div className="mood-selector">
                  <span className="mood active">😊</span>
                  <span className="mood">😐</span>
                  <span className="mood">😔</span>
                  <span className="mood">😤</span>
                  <span className="mood">😰</span>
                </div>
              </div>
              <div className="card-content">
                <p className="journal-preview">
                  Today I felt grateful for the small moments. The morning coffee,
                  the sunshine through my window...
                </p>
                <div className="card-footer">
                  <span className="entry-time">✍️ 2 mins ago</span>
                  <button onClick={() => setCurrentPage('chat')} className="reflect-btn">
                    ✨ Reflect with AI
                  </button>
                </div>
              </div>
            </div>
            <div className="floating-elements">
              <div className="float-element float-1">🧘</div>
              <div className="float-element float-2">💭</div>
              <div className="float-element float-3">🌱</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Features</span>
            <h2>Designed for Your <span className="text-gradient">Peace of Mind</span></h2>
            <p>Everything you need to reflect, grow, and maintain mental clarity.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>Guest Mode First</h3>
              <p>Start immediately without creating an account. No sign-ups, no barriers — just you and your thoughts.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Daily Check-in</h3>
              <p>Quick mood selection and journaling. Express yourself in seconds or take your time with longer entries.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Local-First Storage</h3>
              <p>Your data stays on your device. We believe your thoughts belong to you — and only you.</p>
            </div>

            <div className="feature-card featured">
              <div className="feature-badge">Premium</div>
              <div className="feature-icon">✨</div>
              <h3>AI Reflection</h3>
              <p>Get gentle, thoughtful reflections on your entries. AI acts as a mirror, not a therapist — asking questions to deepen your self-awareness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2>Simple, Mindful, <span className="text-gradient">Private</span></h2>
            <p>A thoughtful approach to digital journaling.</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Write Freely</h3>
                <p>Open the app and start journaling. Select your mood or dive straight into writing. Everything stays on your device.</p>
              </div>
              <div className="step-visual">📝</div>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Choose When to Reflect</h3>
                <p>Only when you tap "Reflect with AI" does your entry get processed. You're always in control.</p>
              </div>
              <div className="step-visual">🎯</div>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Gain Insights</h3>
                <p>Receive thoughtful questions and reflections. The AI helps you see patterns — never prescribes solutions.</p>
              </div>
              <div className="step-visual">💡</div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="privacy section">
        <div className="container">
          <div className="privacy-content">
            <div className="privacy-text">
              <span className="section-label">Privacy & Security</span>
              <h2>Your Thoughts, <span className="text-gradient">Your Control</span></h2>
              <p className="privacy-description">
                We built MindJournal with privacy as the foundation, not an afterthought.
                Your mental wellness journey deserves complete confidentiality.
              </p>

              <ul className="privacy-list">
                <li>
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Zero Data Tracking</strong>
                    <span>No analytics, no data harvesting, no ads.</span>
                  </div>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Stateless AI Processing</strong>
                    <span>AI doesn't remember past conversations or build profiles.</span>
                  </div>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Encrypted Sync (Optional)</strong>
                    <span>If you choose to backup, it's end-to-end encrypted.</span>
                  </div>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>No Medical Claims</strong>
                    <span>AI reflects, it doesn't diagnose or prescribe.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="privacy-visual">
              <div className="shield-container">
                <div className="shield">🛡️</div>
                <div className="shield-ring"></div>
                <div className="shield-ring ring-2"></div>
              </div>
              <div className="privacy-badges">
                <span className="privacy-badge">Local Storage</span>
                <span className="privacy-badge">No Tracking</span>
                <span className="privacy-badge">E2E Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="cta section">
        <div className="container">
          <div className="cta-content">
            <h2>Start Your Mindful Journey Today</h2>
            <p>Join thousands who've found clarity through private, thoughtful reflection.</p>
            <div className="cta-buttons">
              <button onClick={() => setCurrentPage('chat')} className="btn btn-primary btn-lg">
                Mulai Chat Sekarang
                <span className="btn-arrow">→</span>
              </button>
            </div>
            <span className="cta-note">No account required • Always free • Your data stays yours</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <a href="/" className="nav-logo">
                <span className="logo-icon">🌿</span>
                <span className="logo-text">MindJournal</span>
              </a>
              <p>A safe space for daily reflection and mental wellness.</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#privacy">Privacy</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
              </div>
              <div className="footer-column">
                <h4>Connect</h4>
                <a href="#">Twitter</a>
                <a href="#">GitHub</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 MindJournal. Made with 💚 for mental wellness.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
