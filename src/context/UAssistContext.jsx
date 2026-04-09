import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TOOL_REGISTRY, KNOWLEDGE_BASE } from '@/data/uassistData';

const UAssistContext = createContext();

export function UAssistProvider({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "👋 Hey! I'm UAssist. I can help you order food, find rooms, report issues, or find events. What do you need?", time: 'Just now' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [queryCount, setQueryCount] = useState(0);
  const queryLimit = 10;
  const [isPremium, setIsPremium] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [prefillText, setPrefillText] = useState('');

  // 1. CONTEXT DETECTION
  const getActiveContext = () => {
    const path = router.pathname;
    if (path === '/map') return { type: 'map', label: 'Viewing Campus Map', icon: '🗺' };
    if (path.includes('caffinity')) return { type: 'food', label: 'Browsing Caffenity Menu', icon: '🍔' };
    if (path === '/arena') return { type: 'events', label: 'Viewing Arena Events', icon: '🎫' };
    if (path === '/problembox') return { type: 'report', label: 'ProblemBox Command Center', icon: '🔧' };
    return { type: 'general', label: 'Campus Dashboard', icon: '🤖' };
  };

  // 2. INTENT & TOOL PROCESSING (Agentic Simulation)
  const processMessage = async (text) => {
    if (queryCount >= queryLimit && !isPremium) return 'LIMIT_REACHED';

    const lowerText = text.toLowerCase();
    setIsThinking(true);
    setQueryCount(prev => prev + 1);

    // Simulate RAG / Tool Selection
    await new Promise(r => setTimeout(r, 1500)); 

    let response = {
      id: Date.now(),
      role: 'ai',
      content: "",
      actionCard: null,
      time: 'Just now'
    };

    // Tool Matching Logic
    if (lowerText.includes('order') || lowerText.includes('brew') || lowerText.includes('coffee')) {
      setThinkingText('Checking Caffenity menu...');
      await new Promise(r => setTimeout(r, 1000));
      response.content = "Found it! Here's your order preview:";
      response.actionCard = {
        type: 'ORDER',
        title: 'Cold Brew Coffee',
        price: '₹80',
        subtitle: 'Ready in ~10 mins',
        buttonText: 'Confirm & Pay'
      };
    } else if (lowerText.includes('where') || lowerText.includes('lab') || lowerText.includes('find')) {
       setThinkingText('Accessing Campus Directory...');
       await new Promise(r => setTimeout(r, 1000));
       response.content = "Opening map directions for you:";
       response.actionCard = {
         type: 'NAVIGATE',
         title: 'AI/ML Lab',
         subtitle: 'CSE Block • Floor 2 • I-201',
         meta: '3 min walk',
         buttonText: 'Open Map →'
       };
    } else if (lowerText.includes('sparking') || lowerText.includes('broken') || lowerText.includes('report')) {
       setThinkingText('Analyzing severity...');
       await new Promise(r => setTimeout(r, 1000));
       response.content = "I detected a critical issue. Should I raise this ticket?";
       response.actionCard = {
         type: 'REPORT',
         priority: 'CRITICAL',
         title: 'AC Sparking Noise',
         subtitle: 'Engineering Block • Lab 4',
         buttonText: 'Raise Ticket →'
       };
    } else if (lowerText.includes('event') || lowerText.includes('register') || lowerText.includes('join')) {
       setThinkingText('Syncing with Arena...');
       await new Promise(r => setTimeout(r, 1000));
       response.content = "CodePulse Hackathon looks great! Want to RSVP?";
       response.actionCard = {
         type: 'RSVP',
         title: 'CodePulse Hackathon',
         subtitle: '+ Rohan + Priya (Duo Sync)',
         buttonText: 'Register All →'
       };
    } else if (lowerText.includes('print') || lowerText.includes('upload') || lowerText.includes('pdf') || lowerText.includes('assignment')) {
       setThinkingText('Analyzing document metadata...');
       await new Promise(r => setTimeout(r, 1000));
       response.content = "Ready to print! Does this look correct?";
       response.actionCard = {
         type: 'PRINT',
         title: 'Assignment_Final.pdf',
         subtitle: '14 pages • Double-sided • B&W',
         meta: '₹28.00',
         buttonText: 'Confirm Print'
       };
    } else if (lowerText.includes('vegeterian') || lowerText.includes('veg') || lowerText.includes('food') || lowerText.includes('lunch')) {
       setThinkingText('Filtering Caffenity menu...');
       await new Promise(r => setTimeout(r, 1200));
       response.content = "Here are some top-rated vegetarian options available right now:";
       response.actionCard = {
         type: 'FOOD_CARDS',
         data: [
           { name: 'Paneer Tikka Roll', price: 120, canteen: 'Main Cafe', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600' },
           { name: 'Veggie Delite Sandwich', price: 95, canteen: 'Food Court', image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80&w=600' },
           { name: 'Classic Margherita', price: 150, canteen: 'Pizza Point', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=600' }
         ]
       };
    } else if (lowerText.includes('pen') || lowerText.includes('stationery') || lowerText.includes('notebook') || lowerText.includes('buy')) {
       setThinkingText('Scanning Campus Store inventory...');
       await new Promise(r => setTimeout(r, 1200));
       // Filter sample from real data
       const stationeryItems = [
          { id: 'rp-005', name: 'Pilot G2 Premium Pens', price: 450, rating: 4.9, image: 'https://images.unsplash.com/photo-1511376916892-91f86807eb36?auto=format&fit=crop&q=80&w=600' },
          { id: 'rp-006', name: 'Spiral Notebook', price: 280, rating: 4.7, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=600' },
          { id: 'rp-010', name: 'Pastel Highlighters', price: 320, rating: 4.9, image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=600' }
       ];
       response.content = "The Campus Store has these essentials in stock for you:";
       response.actionCard = {
         type: 'STATIONERY_CARDS',
         data: stationeryItems
       };
    } else {
       // Knowledge Base Search (Simplified)
       const kbMatch = KNOWLEDGE_BASE.find(kb => kb.tags.some(tag => lowerText.includes(tag)));
       if (kbMatch) {
         response.content = kbMatch.content;
       } else {
         response.content = "I'm not quite sure about that. Want me to connect you with a student ambassador?";
       }
    }

    setIsThinking(false);
    setThinkingText('');
    setMessages(prev => [...prev, response]);
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
      prefillText, setPrefillText
    }}>
      {children}
    </UAssistContext.Provider>
  );
}

export function useUAssist() {
  return useContext(UAssistContext);
}
