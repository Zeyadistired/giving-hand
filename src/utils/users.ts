import { supabase } from './supabaseClient';
import { UserRole } from '@/types';

export const getUsersByType = async (type: UserRole) => {
  const { data, error } = await supabase
    .from('users')
    .select('*, category')
    .eq('type', type);
    
  if (error) throw error;
  return data;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
    
  if (error) throw error;
  return data;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

export const updateUser = async (id: string, updates: Partial<{
  name: string;
  email: string;
  type: UserRole;
}>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}; 