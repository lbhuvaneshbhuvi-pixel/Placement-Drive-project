const API_URL = 'http://localhost:5000/api';

    // wrapper around fetch to pass the token everywhere
    request: async (endpoint, method = 'GET', body = null) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // auth endpoints
    login: (credentials) => api.request('/auth/login', 'POST', credentials),
    signup: (userData) => api.request('/auth/signup', 'POST', userData),
    logout: () => api.request('/auth/logout', 'POST'),

    // employee endpoints
    getEmployees: () => api.request('/employees'),
    createEmployee: (data) => api.request('/employees', 'POST', data),
    updateEmployee: (id, data) => api.request(`/employees/${id}`, 'PUT', data),
    deleteEmployee: (id) => api.request(`/employees/${id}`, 'DELETE'),

    // dept endpoints
    getDepartments: () => api.request('/departments')
};
