const API_BASE_URL = 'https://avinash159-159-campusbuddy.hf.space';

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Auto-handle 401 Unauthorized
    if (response.status === 401 && !url.includes('/login') && !url.includes('/register')) {
       console.error('Session expired or unauthorized. Clearing tokens...');
       if (typeof window !== 'undefined') {
         localStorage.removeItem('access_token');
         localStorage.removeItem('refresh_token');
         // We let the app handle the actual redirect/state change via checkSession or UI
       }
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}
