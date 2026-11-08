import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import ChatMessage from '../../components/ai/ChatMessage';
import TypingIndicator from '../../components/ai/TypingIndicator';
import SuggestedPrompts from '../../components/ai/SuggestedPrompts';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  BotMessageSquare,
  Send,
  Trash2,
  Sparkles,
  Languages,
  Code2,
  BookOpen
} from 'lucide-react';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      role: 'assistant',
      language: 'en',
      content: `Hello! I am **Quentrix AI**, your intelligent academic companion and technical assessment tutor.

I can help you with:
- **Core Engineering Concepts**: Data Structures, Algorithms, OS, DBMS, Networks, and Web Dev.
- **Code Optimization & Debugging**: C, C++, Java, Python, and JavaScript.
- **Exam Preparation Strategy**: Mock tests, negative marking formulas, and formula revisions.
- **Bilingual Tutoring**: Ask me questions in **English** or **Telugu (తెలుగు)**!

How would you like to level up your engineering practice today?`
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeLang, setActiveLang] = useState('en'); // 'en', 'te'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend = input, langOverride = activeLang) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text,
      language: langOverride
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await aiService.askChatbot({
        message: text,
        history: messages,
        language: langOverride
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          ...reply
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered a temporary network issue. Please retry your question.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'msg_welcome_' + Date.now(),
        role: 'assistant',
        language: activeLang,
        content: activeLang === 'te'
          ? 'చాట్ చరిత్ర క్లియర్ చేయబడింది. మీకు ఏ కాన్సెప్ట్‌లో సహాయం కావాలి?'
          : 'Conversation cleared. How can I assist your engineering study today?'
      }
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', gap: '1rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <h1 className="heading-2" style={{ margin: 0 }}>Quizora AI Academic Tutor</h1>
            <Badge variant="primary" dot>Live Knowledge Base</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Curriculum doubt resolution, code step explanations, and exam preparation in English & Telugu.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Switcher */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveLang('en')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: activeLang === 'en' ? 'var(--accent-primary)' : 'transparent',
                color: activeLang === 'en' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button
              onClick={() => setActiveLang('te')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: activeLang === 'te' ? 'var(--accent-secondary)' : 'transparent',
                color: activeLang === 'te' ? '#191B18' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              తెలుగు (Telugu)
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            leftIcon={<Trash2 size={14} />}
          >
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <Card
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
          <SuggestedPrompts onSelectPrompt={(prompt, lang) => {
            setActiveLang(lang || 'en');
            handleSendMessage(prompt, lang || 'en');
          }} />

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeLang === 'te' ? 'మీ సందేహాన్ని ఇక్కడ టైప్ చేయండి (ఉదా: AVL ట్రీ వివరించండి)...' : 'Ask an academic or coding question (e.g. Explain AVL rotations)...'}
              style={{
                flex: 1,
                padding: '0.8rem 1.1rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim() || isTyping}
              rightIcon={<Send size={16} />}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
