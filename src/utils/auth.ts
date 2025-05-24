import { UserRole } from "@/types";
import { supabase } from './supabaseClient';

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

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Get user details from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  if (userError) throw userError;

  // If user doesn't exist in users table, create it
  if (!userData) {
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email?.split('@')[0] || 'User',
          type: 'organization', // Default type
        }
      ])
      .select()
      .single();

    if (createError) throw createError;
    return newUser;
  }

  return userData;
};

export const signUp = async ({
  email,
  password,
  fullName,
  username,
  userType,
  organizationType,
  charityCategory,
}: {
  email: string;
  password: string;
  fullName: string;
  username: string;
  userType: string;
  organizationType?: string;
  charityCategory?: string;
}) => {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  // Prepare user data, only including organization_type and category if they have values
  const userInsertData: any = {
    id: authData.user?.id,
    email,
    name: fullName,
    username,
    type: userType,
  };

  // Only add organization_type if it has a value
  if (organizationType && organizationType !== "") {
    userInsertData.organization_type = organizationType;
  }

  // Only add category if it has a value
  if (charityCategory && charityCategory !== "") {
    userInsertData.category = charityCategory;
  }

  // Create user record in users table
  const { data: insertedUser, error: userError } = await supabase
    .from('users')
    .insert([userInsertData])
    .select()
    .single();

  if (userError) throw userError;

  return insertedUser;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    // If user doesn't exist in users table, create it
    if (!userData) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            name: user.email?.split('@')[0] || 'User',
            type: 'organization', // Default type
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return null;
      }
      return newUser;
    }

    return userData;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

/**
 * Change user password with proper authentication
 */
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    // Get current user
    const user = getUserSession();
    if (!user?.email) {
      throw new Error('User not found. Please log in again.');
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      throw new Error(updateError.message || 'Failed to update password');
    }

    // Send password change notification email
    await sendPasswordChangeNotification(user.email);

    return { success: true, message: 'Password changed successfully' };
  } catch (error: any) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Send password change notification email
 */
export const sendPasswordChangeNotification = async (email: string) => {
  try {
    // Note: This uses Supabase's built-in email functionality
    // In a production environment, you might want to use a custom email template
    // For now, we'll log the notification (in production, this would send an actual email)
    console.log(`Password change notification sent to: ${email}`);

    // You can implement custom email sending here using services like:
    // - Supabase Edge Functions with email providers
    // - SendGrid, Mailgun, etc.
    // - Or use Supabase's built-in email templates

    return { success: true };
  } catch (error: any) {
    console.error('Error sending password change notification:', error);
    // Don't throw here - password change should succeed even if email fails
    return { success: false, error: error.message };
  }
};

/**
 * Reset password via email
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
