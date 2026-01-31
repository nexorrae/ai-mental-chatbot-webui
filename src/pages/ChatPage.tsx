import { useState, useRef, useEffect } from 'react';
import './ChatPage.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatPageProps {
    onBack: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ChatPage({ onBack }: ChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConsent, setShowConsent] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
        }
    }, [input]);

    const handleConsent = () => {
        setShowConsent(false);
        // Add welcome message
        setMessages([
            {
                role: 'assistant',
                content: 'Halo! 👋 Selamat datang di Curhatin. Saya di sini untuk mendengarkan dan menemanimu berefleksi. Bagaimana perasaanmu hari ini?',
                timestamp: new Date(),
            },
        ]);
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Prepare conversation history for API
            const conversationHistory = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    conversation_history: conversationHistory,
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                return;
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Gagal menghubungi server. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Consent Modal
    if (showConsent) {
        return (
            <div className="chat-page">
                <div className="consent-overlay">
                    <div className="consent-modal">
                        <div className="consent-icon">🔒</div>
                        <h2>Sebelum Kita Mulai</h2>
                        <p>
                            Saya adalah asisten AI yang akan menemanimu berefleksi. Beberapa hal penting:
                        </p>
                        <ul className="consent-list">
                            <li>
                                <span className="consent-check">✓</span>
                                Pesan yang kamu kirim akan diproses oleh AI untuk memberikan respons
                            </li>
                            <li>
                                <span className="consent-check">✓</span>
                                Saya bukan terapis atau profesional kesehatan mental
                            </li>
                            <li>
                                <span className="consent-check">✓</span>
                                Data percakapan tidak disimpan secara permanen
                            </li>
                            <li>
                                <span className="consent-check">✓</span>
                                Jika kamu dalam krisis, silakan hubungi layanan darurat
                            </li>
                        </ul>
                        <div className="consent-actions">
                            <button className="btn btn-secondary" onClick={onBack}>
                                Kembali
                            </button>
                            <button className="btn btn-primary" onClick={handleConsent}>
                                Saya Mengerti, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-page">
            {/* Header */}
            <header className="chat-header">
                <button className="back-button" onClick={onBack}>
                    ← Kembali
                </button>
                <div className="chat-title">
                    <span className="chat-icon">🌿</span>
                    <div>
                        <h1>Curhatin</h1>
                        <span className="chat-status">
                            {isLoading ? 'Sedang mengetik...' : 'Online'}
                        </span>
                    </div>
                </div>
                <div className="header-spacer"></div>
            </header>

            {/* Messages */}
            <main className="chat-messages">
                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="message-avatar">🌿</div>
                            )}
                            <div className="message-content">
                                <p>{msg.content}</p>
                                <span className="message-time">{formatTime(msg.timestamp)}</span>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message message-assistant">
                            <div className="message-avatar">🌿</div>
                            <div className="message-content typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <p>{error}</p>
                            <button onClick={() => setError(null)}>Tutup</button>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input */}
            <footer className="chat-input-container">
                <div className="chat-input-wrapper">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        placeholder="Tulis perasaanmu di sini..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className="send-button"
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
                <p className="input-hint">
                    Tekan Enter untuk kirim, Shift+Enter untuk baris baru
                </p>
            </footer>
        </div>
    );
}
