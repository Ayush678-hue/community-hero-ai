import { create } from 'zustand';

export const useStore = create((set) => ({
  // Authentication State
  token: null,
  user: null,
  isAuthenticated: false,
  
  // Geolocation State (Set to null initially to trigger browser geolocation)
  userCoords: null,
  locationAccuracy: null,
  
  // Complaints & Notifications Lists
  complaints: [],
  notifications: [],
  leaderboard: [],
  stats: {
    total: 0,
    resolved: 0,
    inProgress: 0,
    verified: 0,
    reported: 0,
    resolutionRate: 0,
    categories: [],
    departments: []
  },

  // Actions
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  setUser: (user) => set({ user }),
  setUserCoords: (coords) => set({ userCoords: coords }),
  setLocationAccuracy: (accuracy) => set({ locationAccuracy: accuracy }),
  
  login: (user, token) => {
    localStorage.setItem('hero_token', token);
    localStorage.setItem('hero_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('hero_token');
    localStorage.removeItem('hero_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadStoredAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('hero_token');
      const userStr = localStorage.getItem('hero_user');
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isAuthenticated: true });
      }
    }
  },

  setComplaints: (complaints) => set({ complaints }),
  
  addComplaint: (complaint) => set((state) => ({
    complaints: [complaint, ...state.complaints]
  })),

  updateComplaint: (updated) => set((state) => ({
    complaints: state.complaints.map((c) => c._id === updated._id || c._id === updated.id ? { ...c, ...updated } : c)
  })),

  setNotifications: (notifications) => set({ notifications }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),

  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setStats: (stats) => set({ stats }),

  // Award points animation utility helper
  awardPoints: (amount) => set((state) => {
    if (!state.user) return {};
    const updatedUser = { ...state.user, heroPoints: state.user.heroPoints + amount };
    localStorage.setItem('hero_user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  })
}));
