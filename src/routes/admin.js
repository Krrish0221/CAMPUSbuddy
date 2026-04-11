import { fetchApi } from '@/utils/api';

/**
 * AUTHENTICATION
 */
export const logoutAdmin = () => 
  fetchApi('/logout/admin', { method: 'POST' });

/**
 * ARENA (EVENT MANAGEMENT)
 */
export const addArenaEvent = (eventData) => 
  fetchApi('/api/arena/events', { method: 'POST', body: JSON.stringify(eventData) });

export const updateArenaEvent = (id, eventData) => 
  fetchApi(`/api/arena/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) });

export const deleteArenaEvent = (id) => 
  fetchApi(`/api/arena/events/${id}`, { method: 'DELETE' });

/**
 * PROBLEM BOX (MANAGEMENT)
 */
export const updateTicketStatusAdmin = (id, status, officialResponse) => 
  fetchApi(`/api/problembox/tickets/${id}/status`, { 
    method: 'PATCH', 
    body: JSON.stringify({ status, official_response: officialResponse }) 
  });

export const assignTicketAdmin = (id, departmentId) => 
  fetchApi(`/api/problembox/tickets/${id}/assign`, { 
    method: 'POST', 
    body: JSON.stringify({ assigned_to: departmentId }) 
  });
