export const mockLogin = (email: string, password: string): string | null => {
  if (email.endsWith('@intucate.com') && password.length >= 8) {
    const token = btoa(JSON.stringify({ email, exp: Date.now() + 3600000 }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    return token;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};