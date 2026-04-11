import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTickets, createTicket } from '@/routes/user';

const ProblemBoxContext = createContext();

export function ProblemBoxProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isAdminView, setIsAdminView] = useState(false);
  const [hasNewCriticalAlert, setHasNewCriticalAlert] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // 1. Initial Data Fetch
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getTickets();
      if (res.success) setTickets(res.data);
    } catch (e) {
      console.error('Error loading tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const addTicket = async (ticketData) => {
    try {
       const res = await createTicket(ticketData);
       if (res.success) {
         loadTickets(); // Refresh list
       }
    } catch (e) {
      console.error('Error raising ticket');
    }
  };

  // Sound effect simulation
  const playPing = () => {
    try {
      const audio = new Audio('/sounds/status_ping.mp3');
      audio.volume = 0.3;
      // audio.play().catch(() => {}); // Browsers might block this, but logic is there
    } catch(e) {}
  };

  const upvoteTicket = (id) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, upvotes: t.upvotes + 1, hasUpvoted: true } : t
    ));
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const reopenTicket = (id) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const resetTimeline = t.timeline.map((step, idx) => ({
          ...step,
          completed: idx === 0,
          active: idx === 0,
          time: idx === 0 ? 'Reopened' : 'Pending'
        }));
        return { 
          ...t, 
          status: 'Raised', 
          timeline: resetTimeline, 
          officialResponse: null,
          resolution: null,
          hasResolvedViewed: false
        };
      }
      return t;
    }));
  };

  const updateTicketStatus = (id, newStatus, extraData = {}) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        // Handle timeline index finding based on the step name
        const updatedTimeline = t.timeline.map(step => {
          if (step.step === newStatus || (newStatus === 'InProgress' && step.step === 'In Progress')) {
             return { ...step, completed: true, active: true, time: 'Just now' };
          }
          if (step.active) return { ...step, active: false };
          return step;
        });
        
        playPing();
        return { ...t, status: newStatus, timeline: updatedTimeline, ...extraData };
      }
      return t;
    }));
  };

  const addAdminResponse = (id, response) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, aiSummary: response, officialResponse: response } : t
    ));
  };

  const assignTicket = (id, deptId) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, assignedTo: deptId, status: 'Triaged' } : t
    ));
  };

  const toggleAdmin = () => setIsAdminView(prev => !prev);
  const dismissAlert = () => setHasNewCriticalAlert(false);

  const addSuggestion = (text) => {
    setSuggestions(prev => [{
      id: Date.now(),
      text,
      upvotes: 0,
      time: 'Just now'
    }, ...prev]);
  };

  const upvoteSuggestion = (id) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s
    ));
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  return (
    <ProblemBoxContext.Provider value={{
      tickets,
      isLoading,
      isAdminView,
      hasNewCriticalAlert,
      toggleAdmin,
      dismissAlert,
      addTicket,
      upvoteTicket,
      updateTicketStatus,
      addAdminResponse,
      assignTicket,
      suggestions,
      addSuggestion,
      upvoteSuggestion,
      reopenTicket
    }}>
      {children}
    </ProblemBoxContext.Provider>
  );
}

export function useProblemBox() {
  const context = useContext(ProblemBoxContext);
  if (!context) {
    throw new Error('useProblemBox must be used within a ProblemBoxProvider');
  }
  return context;
}
