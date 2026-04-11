import { fetchApi } from '@/utils/api';

/**
 * AUTHENTICATION & PROFILE
 */
export const login = (email, password) => 
  fetchApi('/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (data) => 
  fetchApi('/register', { method: 'POST', body: JSON.stringify(data) });

export const verifyOtp = (email, otp_code) => 
  fetchApi('/api/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp_code }) });

export const getUserProfile = () => 
  fetchApi('/api/user/profile');

export const searchStudents = (query) =>
  fetchApi(`/api/user/search?query=${encodeURIComponent(query)}`);

export const logoutUser = () => 
  fetchApi('/logout/user', { method: 'POST' });

/**
 * CAFFINITY (FOOD)
 */
export const getCanteens = () => 
  fetchApi('/api/caffenity/canteens');

export const getMenu = (canteenId = null) => {
  const endpoint = canteenId ? `/api/caffenity/menu?canteen_id=${canteenId}` : '/api/caffenity/menu';
  return fetchApi(endpoint);
};

export const placeCaffinityOrder = (orderData) =>
  fetchApi('/api/caffenity/order', { method: 'POST', body: JSON.stringify(orderData) });

/**
 * ARENA (EVENTS)
 */
export const getArenaEvents = () => 
  fetchApi('/api/arena/events');

export const rsvpArenaEvent = (data) =>
  fetchApi('/api/arena/rsvp', { method: 'POST', body: JSON.stringify(data) });

export const getArenaRegistrations = () =>
  fetchApi('/api/arena/registrations');

export const sendArenaTeamSync = (data) =>
  fetchApi('/api/arena/team-sync', { method: 'POST', body: JSON.stringify(data) });

export const getArenaTeamSyncs = () =>
  fetchApi('/api/arena/team-sync');

export const updateArenaTeamSync = (syncId, status) =>
  fetchApi(`/api/arena/team-sync/${syncId}`, { method: 'PATCH', body: JSON.stringify({ status }) });

/**
 * SHOPPERZ (STORE & MARKET)
 */
export const getShopperzRetail = () => 
  fetchApi('/api/shopperz/retail');

export const getShopperzMarket = () => 
  fetchApi('/api/shopperz/market');

export const placeShopperzOrder = (data) =>
  fetchApi('/api/shopperz/retail/order', { method: 'POST', body: JSON.stringify(data) });

export const reserveMarketItem = (id, studentId) =>
  fetchApi(`/api/shopperz/market/${id}/reserve`, { method: 'PATCH', body: JSON.stringify({ studentId }) });

export const submitPrintJob = (data) =>
  fetchApi('/api/shopperz/print', { method: 'POST', body: JSON.stringify(data) });

export const getPrintJobs = () =>
  fetchApi('/api/shopperz/print');

/**
 * PROBLEM BOX (TICKETS)
 */
export const getTickets = () => 
  fetchApi('/api/problembox/tickets');

export const createTicket = (ticketData) => 
  fetchApi('/api/problembox/tickets', { method: 'POST', body: JSON.stringify(ticketData) });

/**
 * UASSIST (AI AGENT)
 */
export const uassistChat = (message, userId) => 
  fetchApi('/uassist/chat', { method: 'POST', body: JSON.stringify({ message, user_id: userId, session_id: 'default' }) });

export const uassistArena = (message, userId) => 
  fetchApi('/uassist/arena', { method: 'POST', body: JSON.stringify({ message, user_id: userId, session_id: 'default' }) });
