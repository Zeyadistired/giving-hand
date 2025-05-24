import { supabase } from './supabaseClient';
import { FoodTicket } from '@/types';

// Helper function to convert camelCase to snake_case
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// Helper function to transform object keys to snake_case
const transformToSnakeCase = (obj: any) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Skip otherCategory if it's undefined
    if (key === 'otherCategory' && !value) {
      return acc;
    }
    const snakeKey = toSnakeCase(key);
    return { ...acc, [snakeKey]: value };
  }, {});
};

export const verifyFoodTicketsTable = async () => {
  const { data, error } = await supabase
    .from('food_tickets')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error verifying food_tickets table:', error);
    throw new Error(`Table verification failed: ${error.message}`);
  }
  return true;
};

// Debug function to test database connection and table structure
export const debugDatabase = async () => {
  try {
    console.log('=== DATABASE DEBUG TEST ===');

    // Test 1: Basic connection
    console.log('Test 1: Basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('food_tickets')
      .select('id, status, organization_name')
      .limit(1);

    if (testError) {
      console.error('Database connection test failed:', testError);
      return { success: false, error: testError };
    }

    console.log('✅ Database connection successful');
    console.log('Sample data:', testData);
    console.log('Number of tickets in database:', testData?.length || 0);

    // Show all tickets in database
    const { data: allTickets, error: allError } = await supabase
      .from('food_tickets')
      .select('*');

    if (!allError) {
      console.log('All tickets in database:', allTickets);
      console.log('Total tickets count:', allTickets?.length || 0);
    }

    // Test 2: Insert a simple record
    console.log('Test 2: Insert test...');
    const testTicket = {
      organization_id: '00000000-0000-0000-0000-000000000001',
      organization_name: 'Test Organization',
      food_type: 'Test Food',
      category: 'prepared',
      weight: 1.0,
      expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      pickup_location: 'Test Location',
      preferred_pickup_from: '09:00',
      preferred_pickup_to: '17:00'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('food_tickets')
      .insert([testTicket])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      return { success: false, error: insertError };
    }

    console.log('✅ Insert test successful:', insertData);

    // Test 3: Update the record
    console.log('Test 3: Update test...');
    const { data: updateData, error: updateError } = await supabase
      .from('food_tickets')
      .update({ status: 'accepted' })
      .eq('id', insertData.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update test failed:', updateError);
      // Still try to clean up
      await supabase.from('food_tickets').delete().eq('id', insertData.id);
      return { success: false, error: updateError };
    }

    console.log('✅ Update test successful:', updateData);

    // Test 4: Clean up - delete the test record
    console.log('Test 4: Cleanup...');
    const { error: deleteError } = await supabase
      .from('food_tickets')
      .delete()
      .eq('id', insertData.id);

    if (deleteError) {
      console.error('❌ Delete test failed:', deleteError);
      return { success: false, error: deleteError };
    }

    console.log('✅ Delete test successful');
    console.log('=== ALL DATABASE TESTS PASSED ===');
    return { success: true };

  } catch (error) {
    console.error('❌ Database debug failed:', error);
    return { success: false, error };
  }
};

export const createFoodTicket = async (ticket: Omit<FoodTicket, 'id'>) => {
  try {
    // Transform the ticket data to snake_case
    const transformedTicket = transformToSnakeCase(ticket);

    // First verify the table exists
    await verifyFoodTicketsTable();

    const { data, error } = await supabase
      .from('food_tickets')
      .insert([transformedTicket])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to create ticket: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error('Error in createFoodTicket:', error);
    throw error;
  }
};

export const getFoodTickets = async (filters?: {
  organizationId?: string;
  charityId?: string;
  factoryId?: string;
  status?: string;
  conversionStatus?: string;
}) => {
  let query = supabase
    .from('food_tickets')
    .select('*');

  if (filters) {
    if (filters.organizationId) {
      query = query.eq('organization_id', filters.organizationId);
    }
    if (filters.charityId) {
      query = query.eq('charity_id', filters.charityId);
    }
    if (filters.factoryId) {
      query = query.eq('factory_id', filters.factoryId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.conversionStatus) {
      query = query.eq('conversion_status', filters.conversionStatus);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Simple direct update function for testing
export const updateFoodTicketDirect = async (ticketId: string, status: string, acceptedBy?: string) => {
  try {
    console.log('=== DIRECT UPDATE TEST ===');
    console.log('Ticket ID:', ticketId);
    console.log('Status:', status);
    console.log('Accepted By:', acceptedBy);

    const updateData: any = { status };
    if (acceptedBy) {
      updateData.accepted_by = acceptedBy;
    }

    const { data, error } = await supabase
      .from('food_tickets')
      .update(updateData)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Direct update error:', error);
      throw new Error(`Direct update failed: ${error.message}`);
    }

    console.log('Direct update successful:', data);
    return data;
  } catch (error) {
    console.error('Error in direct update:', error);
    throw error;
  }
};

export const updateFoodTicket = async (ticketId: string, updates: Partial<FoodTicket>) => {
  try {
    console.log('=== UPDATE TICKET DEBUG ===');
    console.log('Ticket ID:', ticketId);
    console.log('Original updates:', updates);

    // First, let's try to fetch the ticket to make sure it exists
    const { data: existingTicket, error: fetchError } = await supabase
      .from('food_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (fetchError) {
      console.error('Error fetching existing ticket:', fetchError);
      throw new Error(`Ticket not found: ${fetchError.message}`);
    }

    console.log('Existing ticket found:', existingTicket);

    // Transform updates to snake_case for database
    const transformedUpdates = transformToSnakeCase(updates);
    console.log('Transformed updates:', transformedUpdates);

    // Try the update
    const { data, error } = await supabase
      .from('food_tickets')
      .update(transformedUpdates)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('=== SUPABASE UPDATE ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error code:', error.code);
      console.error('Full error object:', error);
      throw new Error(`Failed to update ticket: ${error.message}`);
    }

    console.log('=== UPDATE SUCCESSFUL ===');
    console.log('Updated ticket:', data);
    return data;
  } catch (error) {
    console.error('=== GENERAL ERROR ===');
    console.error('Error in updateFoodTicket:', error);
    throw error;
  }
};

// Helper function to transform snake_case back to camelCase for frontend
const transformToCamelCase = (obj: any) => {
  if (!obj || typeof obj !== 'object') return obj;

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    return { ...acc, [camelKey]: value };
  }, {});
};

// Enhanced getFoodTickets with proper transformation
export const getFoodTicketsEnhanced = async (filters?: {
  organizationId?: string;
  charityId?: string;
  factoryId?: string;
  status?: string;
  conversionStatus?: string;
}) => {
  try {
    let query = supabase
      .from('food_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      }
      if (filters.charityId) {
        query = query.eq('accepted_by', filters.charityId);
      }
      if (filters.factoryId) {
        query = query.eq('factory_id', filters.factoryId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.conversionStatus) {
        query = query.eq('conversion_status', filters.conversionStatus);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tickets:', error);
      throw new Error(`Failed to fetch tickets: ${error.message}`);
    }

    // Transform all tickets back to camelCase
    return data?.map(transformToCamelCase) || [];
  } catch (error) {
    console.error('Error in getFoodTicketsEnhanced:', error);
    throw error;
  }
};

export const createDeliveryRequest = async (request: {
  ticketId: string;
  charityId: string;
  organizationId: string;
  fee: number;
}) => {
  const { data, error } = await supabase
    .from('delivery_requests')
    .insert([{
      ...request,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateDeliveryRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
  const { data, error } = await supabase
    .from('delivery_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getDeliveryRequests = async (filters?: {
  charityId?: string;
  organizationId?: string;
  status?: string;
}) => {
  let query = supabase
    .from('delivery_requests')
    .select(`
      *,
      food_tickets (*),
      users!charity_id (name)
    `);

  if (filters) {
    if (filters.charityId) {
      query = query.eq('charity_id', filters.charityId);
    }
    if (filters.organizationId) {
      query = query.eq('organization_id', filters.organizationId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};