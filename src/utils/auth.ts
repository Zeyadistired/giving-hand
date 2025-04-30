
import { UserRole } from "@/types";

// User session type
export interface UserSession {
  id: string;
  name: string;
  email?: string;
  username?: string;
  type: UserRole;
  isPremium?: boolean;
}

/**
 * Set the current user session
 */
export const setUserSession = (user: UserSession): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('userRole', user.type);
  localStorage.setItem('isEditMode', user.type === 'admin' ? 'true' : 'false');
};

/**
 * Get the current user session
 */
export const getUserSession = (): UserSession | null => {
  const userString = localStorage.getItem('currentUser');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString) as UserSession;
  } catch (error) {
    console.error('Error parsing user session:', error);
    return null;
  }
};

/**
 * Get the current user role
 */
export const getUserRole = (): UserRole => {
  const role = localStorage.getItem('userRole') as UserRole;
  const user = getUserSession();
  
  // Ensure consistency between userRole and user.type
  if (user && user.type !== role) {
    localStorage.setItem('userRole', user.type);
    return user.type;
  }
  
  return role || 'guest';
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = (): boolean => {
  return !!getUserSession();
};

/**
 * Clear user session (logout)
 */
export const clearUserSession = (): void => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isEditMode');
};

/**
 * Save user preference
 */
export const saveUserPreference = (key: string, value: any): void => {
  const user = getUserSession();
  if (!user) return;
  
  const prefKey = `user_pref_${user.id}_${key}`;
  localStorage.setItem(prefKey, JSON.stringify(value));
};

/**
 * Get user preference
 */
export const getUserPreference = <T>(key: string, defaultValue?: T): T | undefined => {
  const user = getUserSession();
  if (!user) return defaultValue;
  
  const prefKey = `user_pref_${user.id}_${key}`;
  const value = localStorage.getItem(prefKey);
  
  if (value === null) return defaultValue;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Error parsing user preference:', error);
    return defaultValue;
  }
};
