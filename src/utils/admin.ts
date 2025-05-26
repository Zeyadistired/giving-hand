import { supabase } from "./supabaseClient";

// Admin Dashboard Statistics
export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  totalCharities: number;
  totalFactories: number;
  totalFoodTickets: number;
  pendingTickets: number;
  acceptedTickets: number;
  declinedTickets: number;
  totalDeliveryRequests: number;
  totalMoneyDonations: number;
  totalDonationAmount: number;
}

// User Management Types
export interface User {
  id: string;
  email: string;
  name: string;
  type: 'organization' | 'charity' | 'admin' | 'factory';
  organization_type?: 'restaurant' | 'hotel' | 'supermarket' | 'other';
  description?: string;
  created_at: string;
  updated_at?: string;
}

// Get admin dashboard statistics
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    console.log('Fetching admin stats...');

    // Get user counts by type
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('type');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    const userCounts = users?.reduce((acc, user) => {
      acc[user.type] = (acc[user.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    console.log('User counts:', userCounts);

    // Get food ticket statistics (handle gracefully if table doesn't exist)
    let tickets: any[] = [];
    let ticketCounts: Record<string, number> = {};

    try {
      const { data: ticketData, error: ticketsError } = await supabase
        .from('food_tickets')
        .select('status');

      if (ticketsError) {
        console.warn('Food tickets table error:', ticketsError);
        // Don't throw, just use empty data
      } else {
        tickets = ticketData || [];
        ticketCounts = tickets.reduce((acc, ticket) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      }
    } catch (error) {
      console.warn('Food tickets table not accessible:', error);
    }

    // Get delivery requests count (handle gracefully if table doesn't exist)
    let deliveryCount = 0;
    try {
      const { count, error: deliveryError } = await supabase
        .from('delivery_requests')
        .select('*', { count: 'exact', head: true });

      if (deliveryError) {
        console.warn('Delivery requests table error:', deliveryError);
      } else {
        deliveryCount = count || 0;
      }
    } catch (error) {
      console.warn('Delivery requests table not accessible:', error);
    }

    // Get money donations statistics (handle gracefully if table doesn't exist)
    let donations: any[] = [];
    let totalDonationAmount = 0;

    try {
      const { data: donationData, error: donationsError } = await supabase
        .from('money_donations')
        .select('amount, status');

      if (donationsError) {
        console.warn('Money donations table error:', donationsError);
      } else {
        donations = donationData || [];
        totalDonationAmount = donations.reduce((sum, donation) => {
          return donation.status === 'completed' ? sum + parseFloat(donation.amount) : sum;
        }, 0);
      }
    } catch (error) {
      console.warn('Money donations table not accessible:', error);
    }

    const stats = {
      totalUsers: users?.length || 0,
      totalOrganizations: userCounts.organization || 0,
      totalCharities: userCounts.charity || 0,
      totalFactories: userCounts.factory || 0,
      totalFoodTickets: tickets.length || 0,
      pendingTickets: ticketCounts.pending || 0,
      acceptedTickets: ticketCounts.accepted || 0,
      declinedTickets: ticketCounts.declined || 0,
      totalDeliveryRequests: deliveryCount,
      totalMoneyDonations: donations.length || 0,
      totalDonationAmount
    };

    console.log('Admin stats result:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

// Get all users for management
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Update user information
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Get users by type (organizations, charities, factories)
export const getUsersByType = async (userType: 'organization' | 'charity' | 'factory'): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('type', userType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching ${userType}s:`, error);
    throw error;
  }
};

// Get all organizations with their details
export const getAllOrganizations = async (): Promise<User[]> => {
  return getUsersByType('organization');
};

// Get all charities with their details
export const getAllCharities = async (): Promise<User[]> => {
  return getUsersByType('charity');
};

// Get all factories with their details
export const getAllFactories = async (): Promise<User[]> => {
  return getUsersByType('factory');
};

// Update organization details
export const updateOrganization = async (orgId: string, updates: {
  name?: string;
  description?: string;
  organization_type?: 'restaurant' | 'hotel' | 'supermarket' | 'other';
  email?: string;
}): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', orgId)
      .eq('type', 'organization')
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

// Update charity details
export const updateCharity = async (charityId: string, updates: {
  name?: string;
  description?: string;
  email?: string;
}): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', charityId)
      .eq('type', 'charity')
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating charity:', error);
    throw error;
  }
};

// Update factory details
export const updateFactory = async (factoryId: string, updates: {
  name?: string;
  description?: string;
  email?: string;
}): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', factoryId)
      .eq('type', 'factory')
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating factory:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Get recent food tickets for admin overview
export const getRecentFoodTickets = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('food_tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent tickets:', error);
    throw error;
  }
};

// Get recent money donations for admin overview
export const getRecentDonations = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('money_donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent donations:', error);
    throw error;
  }
};

// Content management functions
export interface ContentItem {
  id: string;
  key: string;
  value: string;
  page: string;
  updated_at: string;
}

// Save content to database
export const saveContent = async (key: string, value: string, page: string = 'dashboard'): Promise<void> => {
  try {
    // For now, we'll store content in localStorage as a fallback
    // In a real implementation, you'd want a content_management table
    const contentKey = `content_${page}_${key}`;
    localStorage.setItem(contentKey, value);

    console.log(`Content saved: ${contentKey} = ${value}`);
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
};

// Load content from database
export const loadContent = async (key: string, page: string = 'dashboard', defaultValue: string = ''): Promise<string> => {
  try {
    // For now, we'll load from localStorage as a fallback
    // In a real implementation, you'd query a content_management table
    const contentKey = `content_${page}_${key}`;
    return localStorage.getItem(contentKey) || defaultValue;
  } catch (error) {
    console.error('Error loading content:', error);
    return defaultValue;
  }
};

// Get detailed analytics data for reports
export interface DetailedAnalytics {
  userGrowth: Array<{ date: string; count: number; type: string }>;
  ticketActivity: Array<{ date: string; created: number; accepted: number; declined: number }>;
  donationTrends: Array<{ date: string; amount: number; count: number }>;
  organizationActivity: Array<{ name: string; tickets: number; accepted: number }>;
  charityActivity: Array<{ name: string; tickets: number; donations: number }>;
  topCategories: Array<{ category: string; count: number; weight: number }>;
}

export const getDetailedAnalytics = async (): Promise<DetailedAnalytics> => {
  try {
    console.log('Fetching detailed analytics...');

    // Get user growth data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('created_at, type')
      .order('created_at', { ascending: true });

    if (usersError) {
      console.error('Error fetching users for analytics:', usersError);
      throw usersError;
    }

    // Get ticket activity data (handle gracefully if table doesn't exist)
    let tickets: any[] = [];
    try {
      const { data: ticketData, error: ticketsError } = await supabase
        .from('food_tickets')
        .select('created_at, status, organization_name, category, weight')
        .order('created_at', { ascending: true });

      if (ticketsError) {
        console.warn('Food tickets table error in analytics:', ticketsError);
      } else {
        tickets = ticketData || [];
      }
    } catch (error) {
      console.warn('Food tickets table not accessible in analytics:', error);
    }

    // Get donation data (handle gracefully if table doesn't exist)
    let donations: any[] = [];
    try {
      const { data: donationData, error: donationsError } = await supabase
        .from('money_donations')
        .select('created_at, amount, charity_name, status')
        .order('created_at', { ascending: true });

      if (donationsError) {
        console.warn('Money donations table error in analytics:', donationsError);
      } else {
        donations = donationData || [];
      }
    } catch (error) {
      console.warn('Money donations table not accessible in analytics:', error);
    }

    // Process user growth data
    const userGrowth = processUserGrowthData(users || []);

    // Process ticket activity data
    const ticketActivity = processTicketActivityData(tickets);

    // Process donation trends
    const donationTrends = processDonationTrends(donations);

    // Process organization activity
    const organizationActivity = processOrganizationActivity(tickets);

    // Process charity activity
    const charityActivity = processCharityActivity(tickets, donations);

    // Process top categories
    const topCategories = processTopCategories(tickets);

    const analytics = {
      userGrowth,
      ticketActivity,
      donationTrends,
      organizationActivity,
      charityActivity,
      topCategories
    };

    console.log('Detailed analytics result:', analytics);
    return analytics;
  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    throw error;
  }
};

// Helper functions for data processing
const processUserGrowthData = (users: any[]) => {
  const growthMap = new Map();

  users.forEach(user => {
    const date = new Date(user.created_at).toISOString().split('T')[0];
    const key = `${date}_${user.type}`;

    if (!growthMap.has(key)) {
      growthMap.set(key, { date, count: 0, type: user.type });
    }
    growthMap.get(key).count++;
  });

  return Array.from(growthMap.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const processTicketActivityData = (tickets: any[]) => {
  const activityMap = new Map();

  tickets.forEach(ticket => {
    const date = new Date(ticket.created_at).toISOString().split('T')[0];

    if (!activityMap.has(date)) {
      activityMap.set(date, { date, created: 0, accepted: 0, declined: 0 });
    }

    const activity = activityMap.get(date);
    activity.created++;

    if (ticket.status === 'accepted') activity.accepted++;
    if (ticket.status === 'declined') activity.declined++;
  });

  return Array.from(activityMap.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const processDonationTrends = (donations: any[]) => {
  const trendsMap = new Map();

  donations.forEach(donation => {
    if (donation.status === 'completed') {
      const date = new Date(donation.created_at).toISOString().split('T')[0];

      if (!trendsMap.has(date)) {
        trendsMap.set(date, { date, amount: 0, count: 0 });
      }

      const trend = trendsMap.get(date);
      trend.amount += parseFloat(donation.amount);
      trend.count++;
    }
  });

  return Array.from(trendsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const processOrganizationActivity = (tickets: any[]) => {
  const activityMap = new Map();

  tickets.forEach(ticket => {
    const name = ticket.organization_name;

    if (!activityMap.has(name)) {
      activityMap.set(name, { name, tickets: 0, accepted: 0 });
    }

    const activity = activityMap.get(name);
    activity.tickets++;

    if (ticket.status === 'accepted') activity.accepted++;
  });

  return Array.from(activityMap.values())
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 10); // Top 10
};

const processCharityActivity = (tickets: any[], donations: any[]) => {
  const activityMap = new Map();

  // Process accepted tickets
  tickets.forEach(ticket => {
    if (ticket.status === 'accepted') {
      // Note: We'd need charity info from accepted_by field
      // For now, we'll use a placeholder
      const charityName = 'Various Charities';

      if (!activityMap.has(charityName)) {
        activityMap.set(charityName, { name: charityName, tickets: 0, donations: 0 });
      }

      activityMap.get(charityName).tickets++;
    }
  });

  // Process donations
  donations.forEach(donation => {
    if (donation.status === 'completed' && donation.charity_name) {
      const name = donation.charity_name;

      if (!activityMap.has(name)) {
        activityMap.set(name, { name, tickets: 0, donations: 0 });
      }

      activityMap.get(name).donations += parseFloat(donation.amount);
    }
  });

  return Array.from(activityMap.values())
    .sort((a, b) => (b.tickets + b.donations) - (a.tickets + a.donations))
    .slice(0, 10); // Top 10
};

const processTopCategories = (tickets: any[]) => {
  const categoryMap = new Map();

  tickets.forEach(ticket => {
    const category = ticket.category;

    if (!categoryMap.has(category)) {
      categoryMap.set(category, { category, count: 0, weight: 0 });
    }

    const cat = categoryMap.get(category);
    cat.count++;
    cat.weight += parseFloat(ticket.weight) || 0;
  });

  return Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count);
};

// User tracking and donations interface
export interface UserDonationData {
  id: string;
  name: string;
  email: string;
  type: 'organization' | 'charity' | 'factory';
  organization_type?: string;
  lastActive: string;
  locationEnabled: boolean;
  region?: string;
  foodDonations: {
    totalTickets: number;
    totalWeight: number;
    acceptedTickets: number;
    categories: Record<string, { count: number; weight: number }>;
  };
  moneyDonations: {
    totalAmount: number;
    totalDonations: number;
    completedDonations: number;
    averageAmount: number;
  };
}

// Get comprehensive user tracking data with donations
export const getUserTrackingData = async (): Promise<UserDonationData[]> => {
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) throw usersError;

    // Get food tickets data
    const { data: foodTickets, error: ticketsError } = await supabase
      .from('food_tickets')
      .select('*');

    if (ticketsError) throw ticketsError;

    // Get money donations data
    const { data: moneyDonations, error: donationsError } = await supabase
      .from('money_donations')
      .select('*');

    if (donationsError) throw donationsError;

    // Process data for each user
    const userTrackingData: UserDonationData[] = users?.map(user => {
      // Process food donations
      const userFoodTickets = foodTickets?.filter(ticket =>
        ticket.organization_name === user.name || ticket.accepted_by === user.id
      ) || [];

      const foodDonationCategories: Record<string, { count: number; weight: number }> = {};
      let totalWeight = 0;
      let acceptedTickets = 0;

      userFoodTickets.forEach(ticket => {
        const category = ticket.category || 'other';
        const weight = parseFloat(ticket.weight) || 0;

        if (!foodDonationCategories[category]) {
          foodDonationCategories[category] = { count: 0, weight: 0 };
        }

        foodDonationCategories[category].count++;
        foodDonationCategories[category].weight += weight;
        totalWeight += weight;

        if (ticket.status === 'accepted') {
          acceptedTickets++;
        }
      });

      // Process money donations
      const userMoneyDonations = moneyDonations?.filter(donation =>
        donation.donor_name === user.name || donation.charity_name === user.name
      ) || [];

      const totalMoneyAmount = userMoneyDonations.reduce((sum, donation) =>
        sum + (parseFloat(donation.amount) || 0), 0
      );

      const completedMoneyDonations = userMoneyDonations.filter(donation =>
        donation.status === 'completed'
      ).length;

      const averageMoneyAmount = userMoneyDonations.length > 0
        ? totalMoneyAmount / userMoneyDonations.length
        : 0;

      return {
        id: user.id,
        name: user.name || 'No Name',
        email: user.email || '',
        type: user.type,
        organization_type: user.organization_type,
        lastActive: user.updated_at || user.created_at,
        locationEnabled: true, // Default to true, can be enhanced with actual location data
        region: 'Not specified', // Can be enhanced with actual region data
        foodDonations: {
          totalTickets: userFoodTickets.length,
          totalWeight,
          acceptedTickets,
          categories: foodDonationCategories
        },
        moneyDonations: {
          totalAmount: totalMoneyAmount,
          totalDonations: userMoneyDonations.length,
          completedDonations: completedMoneyDonations,
          averageAmount: averageMoneyAmount
        }
      };
    }) || [];

    return userTrackingData;
  } catch (error) {
    console.error('Error fetching user tracking data:', error);
    throw error;
  }
};

// Delivery Logs interfaces and functions
export interface DeliveryLog {
  id: string;
  ticket_id: string;
  charity_id: string;
  organization_id: string;
  delivery_method: 'pickup' | 'delivery' | 'factory_pickup';
  status: 'pending' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  pickup_time?: string;
  delivery_time?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  driver_name?: string;
  driver_phone?: string;
  vehicle_info?: string;
  pickup_address?: string;
  delivery_address?: string;
  distance_km?: number;
  delivery_cost?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
  // Joined data
  charity_name?: string;
  organization_name?: string;
  food_category?: string;
  food_weight?: number;
}

// Get all delivery logs with joined data
export const getDeliveryLogs = async (): Promise<DeliveryLog[]> => {
  try {
    console.log('Fetching delivery logs...');

    const { data, error } = await supabase
      .from('delivery_logs')
      .select(`
        *,
        charity:charity_id(name),
        organization:organization_id(name),
        ticket:ticket_id(category, weight)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Delivery logs table error:', error);
      // Return empty array if table doesn't exist yet
      return [];
    }

    const logs = data?.map(log => ({
      ...log,
      charity_name: log.charity?.name || 'Unknown Charity',
      organization_name: log.organization?.name || 'Unknown Organization',
      food_category: log.ticket?.category || 'Unknown',
      food_weight: parseFloat(log.ticket?.weight) || 0
    })) || [];

    console.log('Delivery logs result:', logs.length, 'logs found');
    return logs;
  } catch (error) {
    console.warn('Delivery logs table not accessible:', error);
    // Return empty array if table doesn't exist
    return [];
  }
};

// Create a new delivery log
export const createDeliveryLog = async (logData: Partial<DeliveryLog>): Promise<DeliveryLog> => {
  try {
    const { data, error } = await supabase
      .from('delivery_logs')
      .insert(logData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating delivery log:', error);
    throw error;
  }
};

// Update delivery log status
export const updateDeliveryLogStatus = async (
  logId: string,
  status: DeliveryLog['status'],
  updates?: Partial<DeliveryLog>
): Promise<DeliveryLog> => {
  try {
    const { data, error } = await supabase
      .from('delivery_logs')
      .update({ status, ...updates, updated_at: new Date().toISOString() })
      .eq('id', logId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating delivery log:', error);
    throw error;
  }
};

// Meal Tracking interfaces and functions
export interface MealTracking {
  id: string;
  charity_id: string;
  ticket_id?: string;
  meal_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_category?: string;
  portions_prepared: number;
  portions_served: number;
  portions_remaining: number;
  beneficiaries_count: number;
  location?: string;
  volunteer_count?: number;
  preparation_time_minutes?: number;
  serving_start_time?: string;
  serving_end_time?: string;
  feedback_rating?: number;
  feedback_notes?: string;
  cost_per_meal?: number;
  total_cost?: number;
  created_at: string;
  updated_at?: string;
  // Joined data
  charity_name?: string;
  ticket_category?: string;
}

// Get all meal tracking records with joined data
export const getMealTrackingRecords = async (): Promise<MealTracking[]> => {
  try {
    console.log('Fetching meal tracking records...');

    const { data, error } = await supabase
      .from('meal_tracking')
      .select(`
        *,
        charity:charity_id(name),
        ticket:ticket_id(category)
      `)
      .order('meal_date', { ascending: false });

    if (error) {
      console.warn('Meal tracking table error:', error);
      // Return empty array if table doesn't exist yet
      return [];
    }

    const meals = data?.map(meal => ({
      ...meal,
      charity_name: meal.charity?.name || 'Unknown Charity',
      ticket_category: meal.ticket?.category || meal.food_category || 'Unknown'
    })) || [];

    console.log('Meal tracking records result:', meals.length, 'records found');
    return meals;
  } catch (error) {
    console.warn('Meal tracking table not accessible:', error);
    // Return empty array if table doesn't exist
    return [];
  }
};

// Create a new meal tracking record
export const createMealTrackingRecord = async (mealData: Partial<MealTracking>): Promise<MealTracking> => {
  try {
    const { data, error } = await supabase
      .from('meal_tracking')
      .insert(mealData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating meal tracking record:', error);
    throw error;
  }
};

// Update meal tracking record
export const updateMealTrackingRecord = async (
  mealId: string,
  updates: Partial<MealTracking>
): Promise<MealTracking> => {
  try {
    const { data, error } = await supabase
      .from('meal_tracking')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', mealId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating meal tracking record:', error);
    throw error;
  }
};

// Get meal tracking statistics
export const getMealTrackingStats = async () => {
  try {
    console.log('Fetching meal tracking stats...');

    const { data: meals, error } = await supabase
      .from('meal_tracking')
      .select('*');

    if (error) {
      console.warn('Meal tracking stats table error:', error);
      // Return default stats if table doesn't exist
      return {
        totalMeals: 0,
        totalPortionsServed: 0,
        totalBeneficiaries: 0,
        averageRating: 0,
        totalCost: 0,
        mealsByType: {}
      };
    }

    const stats = {
      totalMeals: meals?.length || 0,
      totalPortionsServed: meals?.reduce((sum, meal) => sum + (meal.portions_served || 0), 0) || 0,
      totalBeneficiaries: meals?.reduce((sum, meal) => sum + (meal.beneficiaries_count || 0), 0) || 0,
      averageRating: meals?.length > 0
        ? meals.reduce((sum, meal) => sum + (meal.feedback_rating || 0), 0) / meals.length
        : 0,
      totalCost: meals?.reduce((sum, meal) => sum + (meal.total_cost || 0), 0) || 0,
      mealsByType: meals?.reduce((acc, meal) => {
        acc[meal.meal_type] = (acc[meal.meal_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {}
    };

    console.log('Meal tracking stats result:', stats);
    return stats;
  } catch (error) {
    console.warn('Meal tracking stats table not accessible:', error);
    // Return default stats if table doesn't exist
    return {
      totalMeals: 0,
      totalPortionsServed: 0,
      totalBeneficiaries: 0,
      averageRating: 0,
      totalCost: 0,
      mealsByType: {}
    };
  }
};
