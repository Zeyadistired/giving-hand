import { supabase } from './supabaseClient';

export interface MoneyDonation {
  amount: number;
  charity_id: string;
  payment_method: 'visa' | 'fawry';
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  notes?: string;
}

export const createMoneyDonation = async (donation: MoneyDonation) => {
  const { data, error } = await supabase
    .from('money_donations')
    .insert([{
      ...donation,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateDonationStatus = async (donationId: string, status: 'pending' | 'completed' | 'failed' | 'refunded') => {
  const { data, error } = await supabase
    .from('money_donations')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', donationId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}; 