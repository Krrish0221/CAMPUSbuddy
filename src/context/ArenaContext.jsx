import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MOCK_REGISTRATIONS, PENDING_NETWORK_REQUESTS, EVENTS } from '@/data/arenaData';

const ArenaContext = createContext();

export function ArenaProvider({ children }) {
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTeamTier, setActiveTeamTier] = useState('Duo');
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('Events');
  const [pendingNetworkRequests, setPendingNetworkRequests] = useState(PENDING_NETWORK_REQUESTS);
  const [connections, setConnections] = useState([]);
  const [incomingSyncRequest, setIncomingSyncRequest] = useState(null);
  const [arenaEvents, setArenaEvents] = useState(EVENTS || []);

  const addEvent = useCallback((newEvent) => {
    setArenaEvents(prev => [{ ...newEvent, id: `EVT-${Math.floor(Math.random() * 9000) + 1000}` }, ...prev]);
  }, []);

  const updateEvent = useCallback((id, updatedEvent) => {
    setArenaEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updatedEvent } : ev));
  }, []);

  const deleteEvent = useCallback((id) => {
    setArenaEvents(prev => prev.filter(ev => ev.id !== id));
  }, []);

  // Simulate an incoming sync request after 10s for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIncomingSyncRequest({
        id: 'sync-1',
        requester: { name: 'Krish', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
        event: { title: 'CodePulse Hackathon', banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=300&q=80', id: 'EVT-0492' },
        type: 'Duo'
      });
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const rsvpToEvent = useCallback((event) => {
    setRegistrations(prev => {
      if (prev.some(r => r.eventId === event.id)) return prev;
      
      const newReg = {
        id: `REG-${Math.floor(Math.random() * 9000) + 1000}`,
        eventId: event.id,
        userId: 'u1',
        studentName: 'Rohan Sharma',
        registeredAt: new Date().toISOString(),
        status: 'Confirmed'
      };
      return [...prev, newReg];
    });
  }, []);

  const acceptSyncRequest = useCallback(() => {
    if (incomingSyncRequest) {
      rsvpToEvent(incomingSyncRequest.event);
      setIncomingSyncRequest(null);
      
      setNotifications(prev => {
        const notif = {
          id: Date.now(),
          type: 'incoming',
          message: `Sync confirmed! You and Krish are now a Duo for CodePulse. 🚀`,
          time: 'Just now'
        };
        return [notif, ...prev];
      });
    }
  }, [incomingSyncRequest, rsvpToEvent]);

  const declineSyncRequest = useCallback(() => setIncomingSyncRequest(null), []);

  const sendTeamRequest = useCallback((friend, eventTitle) => {
    setSentRequests(prev => {
      if (prev.includes(friend.id)) return prev;
      return [...prev, friend.id];
    });
    
    const outgoingId = Date.now();
    // Simulate Outgoing Notification
    setNotifications(prev => {
      const outgoingNotif = {
        id: outgoingId,
        type: 'outgoing',
        message: `Request sent to ${friend.name}'s device! 📱`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return [outgoingNotif, ...prev];
    });

    // Auto-remove outgoing after 5s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== outgoingId));
    }, 5000);

    // Simulate Incoming Notification on "Friend's Device" (Mock)
    setTimeout(() => {
      const incomingId = Date.now() + 1;
      setNotifications(prev => {
        const incomingNotif = {
          id: incomingId,
          type: 'incoming',
          message: `${friend.name} received your request for ${eventTitle}!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return [incomingNotif, ...prev];
      });

      // Auto-remove incoming after 5s
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== incomingId));
      }, 5000);
    }, 2000);
  }, []);

  const acceptNetworkRequest = useCallback((requestId) => {
    setPendingNetworkRequests(prev => {
      const request = prev.find(r => r.id === requestId);
      if (request) {
        setConnections(conn => [...conn, request]);
        
        setNotifications(notifs => {
          const notif = {
            id: Date.now(),
            type: 'incoming',
            message: `You are now connected with ${request.name}! 🤝`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return [notif, ...notifs];
        });
        
        return prev.filter(r => r.id !== requestId);
      }
      return prev;
    });
  }, []);

  const declineNetworkRequest = useCallback((requestId) => {
    setPendingNetworkRequests(prev => prev.filter(r => r.id !== requestId));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const value = useMemo(() => ({
    registrations,
    sentRequests,
    activeTeamTier,
    setActiveTeamTier,
    notifications,
    activeTab,
    setActiveTab,
    pendingNetworkRequests,
    connections,
    incomingSyncRequest,
    rsvpToEvent,
    sendTeamRequest,
    acceptNetworkRequest,
    declineNetworkRequest,
    acceptSyncRequest,
    declineSyncRequest,
    clearNotifications,
    setSentRequests,
    arenaEvents,
    addEvent,
    updateEvent,
    deleteEvent
  }), [
    registrations, sentRequests, activeTeamTier, notifications, activeTab, 
    pendingNetworkRequests, connections, incomingSyncRequest, arenaEvents,
    rsvpToEvent, sendTeamRequest, acceptNetworkRequest, declineNetworkRequest,
    acceptSyncRequest, declineSyncRequest, clearNotifications, addEvent,
    updateEvent, deleteEvent
  ]);

  return (
    <ArenaContext.Provider value={value}>
      {children}
    </ArenaContext.Provider>
  );
}

export function useArena() {
  const context = useContext(ArenaContext);
  if (!context) {
    throw new Error('useArena must be used within an ArenaProvider');
  }
  return context;
}
