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

// Helper function to convert snake_case to camelCase
const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Helper function to transform object keys to camelCase
const transformToCamelCase = (obj: any) => {
  if (!obj) return obj;
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = toCamelCase(key);
    return { ...acc, [camelKey]: value };
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

export const createFoodTicket = async (ticket: Omit<FoodTicket, 'id'>) => {
  try {
    // Transform the ticket data to snake_case
    const transformedTicket = transformToSnakeCase(ticket);

    // First verify the table exists
    await verifyFoodTicketsTable();

    // CRITICAL FIX: Ensure food_type is properly set for filtering
    if (ticket.deliveryCapability === "factory-only" ||
        ticket.isExpired === true ||
        new Date(ticket.expiryDate) < new Date()) {
      (transformedTicket as Record<string, any>).food_type = 'expiry';
      console.log("Setting food_type to 'expiry' for factory processing");
    } else {
      (transformedTicket as Record<string, any>).food_type = 'regular';
    }

    // Double-check food_type is set
    console.log("Final food_type value:", (transformedTicket as Record<string, any>).food_type);

    // Ensure dates are properly formatted
    if (ticket.expiryDate) {
      try {
        const expiryDate = new Date(ticket.expiryDate);
        (transformedTicket as Record<string, any>).expiry_date = expiryDate.toISOString();
      } catch (error) {
        console.error("Error formatting expiry date:", error);
      }
    }

    // Explicitly set created_at
    (transformedTicket as Record<string, any>).created_at = new Date().toISOString();

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
  foodType?: string;
  excludeExpiry?: boolean;
}) => {
  try {
    console.log("Getting food tickets with filters:", filters);
    
    let query = supabase
      .from('food_tickets')
      .select('*');
    
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
      
      // CRITICAL FIX: Properly filter by food_type
      if (filters.foodType) {
        console.log("Filtering by food_type:", filters.foodType);
        query = query.eq('food_type', filters.foodType);
      }
      
      if (filters.excludeExpiry) {
        query = query.neq('food_type', 'expiry');
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching food tickets:', error);
      throw error;
    }
    
    console.log("Food tickets fetched:", data);
    return data || [];
  } catch (error) {
    console.error('Error in getFoodTickets:', error);
    throw error;
  }
};

export const updateFoodTicket = async (ticketId: string, updates: Partial<FoodTicket>) => {
  const { data, error } = await supabase
    .from('food_tickets')
    .update(updates)
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
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

// Factory request functions
export const createFactoryRequest = async (request: {
  ticketId: string;
  factoryId: string;
  factoryName: string;
  organizationId: string;
  organizationName: string;
  foodType: string;
  weight: number;
  status: 'accepted' | 'declined';
  notes?: string;
}) => {
  try {
    console.log("Creating factory request with data:", request);
    
    // Verify the factory_requests table exists
    try {
      const { data, error } = await supabase
        .from('factory_requests')
        .select('*')
        .limit(1);

      if (error && error.code === '42P01') {
        console.error('factory_requests table does not exist:', error);
        // Create the table if it doesn't exist
        await supabase.rpc('create_factory_requests_table');
      }
    } catch (tableError) {
      console.error('Error checking factory_requests table:', tableError);
    }
    
    // Insert the factory request with explicit field mapping
    const { data, error } = await supabase
      .from('factory_requests')
      .insert([{
        ticket_id: request.ticketId,
        factory_id: request.factoryId,
        factory_name: request.factoryName,
        organization_id: request.organizationId,
        organization_name: request.organizationName,
        food_type: request.foodType,
        weight: request.weight,
        status: request.status,
        conversion_status: request.status === 'accepted' ? 'pending' : 'rejected',
        notes: request.notes || null,
        request_date: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error creating factory request:', error);
      throw error;
    }
    
    console.log('Factory request created successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Failed to create factory request:', error);
    throw error;
  }
};

export const updateFactoryRequest = async (requestId: string, updates: {
  status?: 'accepted' | 'declined';
  conversionStatus?: 'pending' | 'converted' | 'rejected';
  conversionDate?: string;
  notes?: string;
}) => {
  const updateData: any = {};

  if (updates.status) updateData.status = updates.status;
  if (updates.conversionStatus) updateData.conversion_status = updates.conversionStatus;
  if (updates.conversionDate) updateData.conversion_date = updates.conversionDate;
  if (updates.notes) updateData.notes = updates.notes;

  const { data, error } = await supabase
    .from('factory_requests')
    .update(updateData)
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getFactoryRequests = async (filters?: {
  factoryId?: string;
  organizationId?: string;
  ticketId?: string;
  status?: string;
  conversionStatus?: string;
}) => {
  let query = supabase
    .from('factory_requests')
    .select(`
      *,
      food_tickets (*)
    `);

  if (filters) {
    if (filters.factoryId) {
      query = query.eq('factory_id', filters.factoryId);
    }
    if (filters.organizationId) {
      query = query.eq('organization_id', filters.organizationId);
    }
    if (filters.ticketId) {
      query = query.eq('ticket_id', filters.ticketId);
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

export const getFoodTicketsEnhanced = async (filters?: {
  organizationId?: string;
  charityId?: string;
  factoryId?: string;
  status?: string;
  conversionStatus?: string;
  foodType?: string;
  excludeExpiry?: boolean;
}) => {
  try {
    // Use the existing getFoodTickets function
    const tickets = await getFoodTickets(filters);
    
    // Transform the snake_case keys to camelCase for frontend use
    const enhancedTickets = tickets.map((ticket: any) => transformToCamelCase(ticket));
    
    return enhancedTickets;
  } catch (error) {
    console.error('Error in getFoodTicketsEnhanced:', error);
    throw error;
  }
};
