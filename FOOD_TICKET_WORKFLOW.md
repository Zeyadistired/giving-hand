# Food Ticket Workflow Implementation

This document describes the complete food ticket creation, database storage, and charity approval workflow that has been implemented.

## Overview

The system now supports a complete end-to-end workflow:

1. **Organization creates food ticket** → Saves to Supabase database with all details
2. **Charity sees tickets** → Loads from database in notifications and charity home screen
3. **Charity accepts/rejects** → Updates database with decision and charity info
4. **Real-time updates** → All screens show current status from database

## Database Setup

### 1. Create Supabase Tables

Run the SQL script in `database-schema.sql` in your Supabase SQL editor to create:
- `users` table for organizations and charities
- `food_tickets` table for all ticket data
- `delivery_requests` table for delivery coordination
- `money_donations` table for monetary donations
- Proper indexes and triggers for performance

### 2. Sample Data

The schema includes sample data:
- 4 test users (2 organizations, 1 charity, 1 supermarket)
- 3 sample food tickets in "pending" status

## Implementation Details

### Key Files Modified/Created

1. **`src/utils/tickets.ts`**
   - Enhanced `updateFoodTicket()` with proper error handling
   - Added `getFoodTicketsEnhanced()` with camelCase transformation
   - Added `transformToCamelCase()` helper for database field conversion

2. **`src/pages/charity/Notifications.tsx`**
   - Updated to load tickets from database instead of localStorage
   - Added proper accept/decline handlers that update database
   - Added loading states and error handling
   - Shows toast notifications for user feedback

3. **`src/pages/charity/CharityHome.tsx`**
   - Removed tickets section (tickets now only appear in notifications)
   - Cleaned up ticket-related imports and state
   - Focused on organization browsing functionality

4. **`src/pages/charity/TicketDetail.tsx`**
   - Updated to load individual tickets from database
   - Enhanced accept/decline handlers with database updates
   - Added proper loading states and error handling
   - Removed localStorage fallbacks - database only

5. **`src/pages/organization/CreateTicket.tsx`**
   - Saves tickets to Supabase database only
   - Removed localStorage backup
   - Includes all form fields and validation
   - Shows success/error feedback

6. **`src/pages/factory/FactoryHome.tsx`**
   - Updated to load tickets from database
   - All accept/reject/convert actions use database
   - Removed localStorage dependencies

7. **`src/pages/factory/FactoryTicketDetail.tsx`**
   - Updated to load tickets from database
   - All ticket actions update database
   - Removed localStorage dependencies

## Workflow Testing

### Prerequisites
1. Supabase project set up with tables created
2. Application running with `npm run dev`
3. Test users created (use sample data from schema)

### Test Steps

#### 1. Create Food Ticket (Organization)
1. Navigate to organization home (`/organization`)
2. Click "Create Food Ticket"
3. Fill out the form with:
   - Food type (e.g., "Leftover Pizza")
   - Category (e.g., "prepared")
   - Weight and pieces
   - Expiry date
   - Pickup location and time preferences
   - Notes
4. Submit the form
5. Verify ticket is saved to database

#### 2. View Tickets (Charity)
1. Navigate to notifications (`/notifications`) - this is the only place tickets appear
2. Should see all pending tickets with full details
3. Verify tickets are loaded from database
4. Charity home now focuses only on browsing organizations

#### 3. Accept/Decline Tickets (Charity)
1. In notifications page, click "Accept" on a ticket
2. Verify:
   - Database is updated with `status: "accepted"` and `accepted_by: charity_id`
   - Ticket disappears from pending list
   - Success toast is shown
   - Redirected to ticket details for delivery options
3. For decline: click "Decline" and verify status updates to "declined"

#### 4. View Ticket Details
1. Click "View details" on any ticket
2. Should show complete ticket information
3. If accepted, should show delivery options
4. Accept/decline buttons should work and update database

## Database Schema

### food_tickets Table Structure
```sql
- id (UUID, Primary Key)
- organization_id (UUID, Foreign Key to users)
- organization_name (VARCHAR)
- food_type (VARCHAR)
- category (ENUM: prepared, produce, bakery, dairy, meat, other)
- weight (DECIMAL)
- pieces (INTEGER, optional)
- expiry_date (TIMESTAMP)
- notes (TEXT, optional)
- status (ENUM: pending, accepted, declined, expired, converted)
- accepted_by (UUID, Foreign Key to users, optional)
- delivery_capability (ENUM: self-delivery, accepts-requests, none, factory-only)
- pickup_location (TEXT)
- preferred_pickup_from (VARCHAR)
- preferred_pickup_to (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Error Handling

The system includes comprehensive error handling:
- Database connection failures fall back to localStorage
- Invalid ticket IDs redirect to appropriate pages
- User authentication checks before allowing actions
- Detailed error messages with toast notifications
- Loading states for better user experience

## Real-time Updates

- Tickets are loaded fresh from database on page load
- Accept/decline actions immediately update the database
- Local state is updated optimistically for responsive UI
- Error states revert local changes if database update fails

## Future Enhancements

1. **Real-time subscriptions** using Supabase realtime
2. **Push notifications** when tickets are accepted/declined
3. **Email notifications** for important status changes
4. **Advanced filtering** by location, category, expiry date
5. **Delivery tracking** integration
6. **Analytics dashboard** for organizations and charities

## Troubleshooting

### Common Issues

1. **"Table doesn't exist" error**
   - Run the database schema SQL in Supabase
   - Check Supabase connection credentials

2. **Tickets not showing**
   - Verify sample data was inserted
   - Check browser console for API errors
   - Ensure user is logged in as charity type

3. **Accept/decline not working**
   - Check user authentication
   - Verify database permissions in Supabase
   - Check network tab for API call errors

### Debug Mode
Enable debug logging by checking browser console for:
- "Loaded tickets from database"
- "Ticket accepted/declined successfully"
- Any error messages with stack traces
