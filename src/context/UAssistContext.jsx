import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeContext } from '@/pages/_app';
import { uassistChat, uassistArena } from '@/routes/user';

const UAssistContext = createContext();

export function UAssistProvider({ children }) {
  const router = useRouter();
  const { userProfile } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: `👋 Hey ${userProfile?.name?.split(' ')[0] || ''}! I'm UAssist. I can help you order food, find rooms, report issues, or find events. What do you need?`, time: 'Just now' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [globalLogs, setGlobalLogs] = useState([]);
  const [queryCount, setQueryCount] = useState(0);
  const queryLimit = 10;
  const [isPremium, setIsPremium] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [prefillText, setPrefillText] = useState('');

  // GLOBAL BROADCAST ENGINE
  const [globalBroadcast, setGlobalBroadcast] = useState(null);

  const sendGlobalBroadcast = (message) => {
    setGlobalBroadcast({ id: Date.now(), message });
  };

  const dismissBroadcast = () => {
    setGlobalBroadcast(null);
  };

  // 1. CONTEXT DETECTION
  const getActiveContext = () => {
    const path = router.pathname;
    if (path === '/user/map') return { type: 'map', label: 'Viewing Campus Map', icon: '🗺' };
    if (path.includes('caffinity')) return { type: 'food', label: 'Browsing Caffenity Menu', icon: '🍔' };
    if (path === '/user/arena') return { type: 'events', label: 'Viewing Arena Events', icon: '🎫' };
    if (path === '/user/problembox') return { type: 'report', label: 'ProblemBox Command Center', icon: '🔧' };
    return { type: 'general', label: 'Campus Dashboard', icon: '🤖' };
  };

  // 2. REAL AI PROCESSING (Backend Integration)
  const processMessage = async (text) => {
    if (queryCount >= queryLimit && !isPremium) return 'LIMIT_REACHED';

    setIsThinking(true);
    setThinkingText('Thinking...');
    setQueryCount(prev => prev + 1);

    try {
      // Unified backend call
      const res = await uassistChat(text, userProfile?.id);

      const aiResponse = {
        id: Date.now(),
        role: 'ai',
        content: res.message || "I couldn't process that. Try again?",
        type: res.type || "text",
        data: res.data || [],
        time: 'Just now'
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // LOG TO TELEMETRY
      setGlobalLogs(prev => [{
        id: Date.now(),
        student: userProfile?.name || 'Anonymous',
        query: text,
        intent: aiResponse.actionCard?.type || 'GENERAL_QUERY',
        time: 'Just now',
        fullResponse: aiResponse.content
      }, ...prev]);

    } catch (e) {
      console.error('UAssist API Error:', e);
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: "Sorry, I'm having trouble connecting to my brain! 🧠🔌", time: 'Just now' }]);
    } finally {
       setIsThinking(false);
       setThinkingText('');
    }
  };
   const sendMessage = (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    processMessage(text);
  };

  return (
    <UAssistContext.Provider value={{
      isOpen, setIsOpen,
      messages, sendMessage,
      isThinking, thinkingText,
      activeContext: getActiveContext(),
      queryCount, queryLimit,
      isPremium, setIsPremium,
      conversationHistory,
      prefillText, setPrefillText,
      globalBroadcast, sendGlobalBroadcast, dismissBroadcast,
      globalLogs
    }}>
      {children}
    </UAssistContext.Provider>
  );
}

export function useUAssist() {
  return useContext(UAssistContext);
}
