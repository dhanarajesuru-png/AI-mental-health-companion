import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Wind,
  Brain,
  Eye,
  CloudRain,
  Trees,
  Waves,
  Radio,
  MessageSquare,
  Mic,
  MicOff
} from 'lucide-react';
import { AICompanionService } from '../services/aiCompanion';
import { StorageService } from '../services/storageService';

export default function ChatCompanion({ onOpenCrisis, onLaunchTool, onOpenMoodLogger }) {
  const [messages, setMessages] = useState([
    {
      id: 'm-init',
      sender: 'ai',
      text: "Welcome to your AI Sanctuary Conversational Page. I am AuraMind, your non-clinical AI wellness companion. How are you feeling today?",
      citations: [],
      safetyAudit: { riskLevel: 'SAFE', layerTriggered: 'Initialized' },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSound, setActiveSound] = useState(null);
  const messagesEndRef = useRef(null);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  const quickPrompts = [
    { label: "Reframe a negative thought", text: "I'm having negative thoughts about failing at work. Can you help me reframe them?" },
    { label: "Guide my breathing", text: "I feel panicky and my heart is racing. Can you guide me through breathing?" },
    { label: "5-4-3-2-1 Grounding", text: "I feel overwhelmed and disconnected. Let's do a 5-4-3-2-1 sensory grounding." },
    { label: "Log today's mood", action: () => onOpenMoodLogger() }
  ];

  const ambientSounds = [
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'forest', label: 'Forest', icon: Trees },
    { id: 'ocean', label: 'Ocean Waves', icon: Waves },
    { id: 'noise', label: 'White Noise', icon: Radio }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[Ref:[^\]]+\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const memoryContext = StorageService.getMemorySummaries().map(m => m.text);
      const result = await AICompanionService.generateResponse(text, messages, memoryContext);

      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: result.message,
        citations: result.citations || [],
        safetyAudit: result.safetyAudit,
        recommendedTool: result.recommendedTool,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
      speakText(result.message);

      if (result.isCrisis) {
        onOpenCrisis(result.safetyAudit);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Page Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.05) 100%)',
        border: '1px solid rgba(14, 165, 233, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)'
          }}>
            <MessageSquare size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, color: '#f0f9ff' }}>AI Sanctuary Conversational Page</h2>
            <p style={{ fontSize: '0.82rem', color: '#bae6fd', margin: 0 }}>
              Real-time non-clinical therapeutic guidance powered by CBT/DBT RAG knowledge retrieval
            </p>
          </div>
        </div>

        <span className="badge badge-emerald">
          <ShieldCheck size={12} /> RAG Vector Engine Active
        </span>
      </div>

      {/* Main Chat Container */}
      <div className="module-chat-container" style={{ display: 'flex', flexDirection: 'column', height: '620px' }}>
        
        {/* Top Ambient Sound Bar */}
        <div className="ambient-sound-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e0f2fe' }}>Grounding Soundscapes:</span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {ambientSounds.map(s => {
                const Icon = s.icon;
                const isActive = activeSound === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSound(isActive ? null : s.id)}
                    className={`sound-chip ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={12} /> {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`btn ${voiceEnabled ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {voiceEnabled ? 'Voice On' : 'Voice Off'}
          </button>
        </div>

        {/* Messages Scroll View */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {messages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                maxWidth: '82%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                
                {/* Avatar */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                    : 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: msg.sender === 'ai' ? '0 0 14px rgba(56, 189, 248, 0.4)' : 'none'
                }}>
                  {msg.sender === 'user' ? <User size={18} color="#fff" /> : <Bot size={18} color="#fff" />}
                </div>

                {/* Message Bubble */}
                <div className={msg.sender === 'user' ? 'chat-bubble-user-indigo' : 'chat-bubble-ai-ocean'} style={{
                  padding: '0.95rem 1.25rem',
                  color: '#f8fafc',
                  fontSize: '0.93rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}

                  {/* Interactive Tool Launcher */}
                  {msg.recommendedTool && (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      {msg.recommendedTool === "CBT_REFRAMER" && (
                        <button onClick={() => onLaunchTool('cbt')} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
                          <Brain size={14} /> Open CBT Thought Reframer Wizard
                        </button>
                      )}
                      {msg.recommendedTool === "BREATHING_TIMER" && (
                        <button onClick={() => onLaunchTool('breathing')} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
                          <Wind size={14} /> Launch 4-7-8 Breathing Circle
                        </button>
                      )}
                      {msg.recommendedTool === "GROUNDING_54321" && (
                        <button onClick={() => onLaunchTool('grounding')} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
                          <Eye size={14} /> Launch 5-4-3-2-1 Grounding Tool
                        </button>
                      )}
                      {msg.recommendedTool === "MOOD_LOGGER" && (
                        <button onClick={onOpenMoodLogger} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
                          <Sparkles size={14} /> Log Daily Mood Check-In
                        </button>
                      )}
                    </div>
                  )}

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {msg.citations.map((cite, idx) => (
                        <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                          <FileText size={10} /> {cite}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <div style={{
                fontSize: '0.72rem',
                color: '#64748b',
                marginTop: '0.25rem',
                paddingLeft: msg.sender === 'user' ? 0 : '2.8rem',
                paddingRight: msg.sender === 'user' ? '2.8rem' : 0
              }}>
                {msg.timestamp}
              </div>

            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              <Bot size={18} color="#38bdf8" />
              <span>AuraMind is querying RAG clinical knowledge base...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{
          padding: '0.5rem 1.25rem',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(5, 11, 22, 0.5)'
        }}>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => qp.action ? qp.action() : handleSendMessage(qp.text)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          gap: '0.75rem',
          background: 'rgba(9, 19, 34, 0.95)'
        }}>
          <input 
            type="text"
            className="input-field"
            placeholder={isListening ? "Listening to your voice... Speak now" : "Share what's on your mind... (e.g. 'I feel anxious about tomorrow')"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              borderColor: isListening ? '#ef4444' : undefined,
              boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.4)' : undefined
            }}
          />
          
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'}`}
            style={{
              padding: '0.75rem 1rem',
              background: isListening ? '#ef4444' : 'rgba(255,255,255,0.06)',
              color: isListening ? '#fff' : '#94a3b8',
              borderColor: isListening ? '#ef4444' : 'rgba(255,255,255,0.1)'
            }}
            title={isListening ? "Stop Listening" : "Voice Dictation (Speech to Text)"}
          >
            {isListening ? <MicOff size={18} className="pulse" /> : <Mic size={18} />}
          </button>

          <button 
            onClick={() => handleSendMessage()}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <Send size={18} />
          </button>
        </div>

      </div>

    </div>
  );
}
