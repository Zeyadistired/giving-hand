-- Supabase Database Schema for Food Donation System
-- Run this SQL in your Supabase SQL editor to create the necessary tables

-- Skip users table creation since it already exists with constraints
-- We'll work with the existing users table structure

-- Add columns to existing users table if they don't exist
-- Note: These will fail silently if columns already exist, which is fine

-- Add type column
ALTER TABLE users ADD COLUMN IF NOT EXISTS type VARCHAR(50) CHECK (type IN ('organization', 'charity', 'admin', 'factory'));

-- Add organization_type column
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_type VARCHAR(50) CHECK (organization_type IN ('restaurant', 'hotel', 'supermarket', 'other'));

-- Add description column
ALTER TABLE users ADD COLUMN IF NOT EXISTS description TEXT;

-- Add name column (might be called display_name or full_name in your setup)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Create food_tickets table
CREATE TABLE IF NOT EXISTS food_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    food_type VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('prepared', 'produce', 'bakery', 'dairy', 'meat', 'other')),
    weight DECIMAL(10,2) NOT NULL,
    pieces INTEGER,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'converted')),
    accepted_by UUID,
    delivery_capability VARCHAR(50) CHECK (delivery_capability IN ('self-delivery', 'accepts-requests', 'none', 'factory-only')),
    org_delivery_status VARCHAR(20) CHECK (org_delivery_status IN ('pending', 'accepted', 'declined')),
    is_expired BOOLEAN DEFAULT FALSE,
    factory_id VARCHAR(50),
    factory_name VARCHAR(255),
    conversion_status VARCHAR(20) CHECK (conversion_status IN ('pending', 'converted', 'rejected')),
    pickup_location TEXT,
    preferred_pickup_from VARCHAR(10),
    preferred_pickup_to VARCHAR(10),
    other_category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery_requests table
CREATE TABLE IF NOT EXISTS delivery_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES food_tickets(id) ON DELETE CASCADE,
    charity_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create money_donations table
CREATE TABLE IF NOT EXISTS money_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    charity_id UUID,
    charity_name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_tickets_organization_id ON food_tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_food_tickets_status ON food_tickets(status);
CREATE INDEX IF NOT EXISTS idx_food_tickets_accepted_by ON food_tickets(accepted_by);
CREATE INDEX IF NOT EXISTS idx_food_tickets_created_at ON food_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_ticket_id ON delivery_requests(ticket_id);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_charity_id ON delivery_requests(charity_id);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_organization_id ON delivery_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at (drop first if they exist)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_food_tickets_updated_at ON food_tickets;
DROP TRIGGER IF EXISTS update_delivery_requests_updated_at ON delivery_requests;
DROP TRIGGER IF EXISTS update_money_donations_updated_at ON money_donations;

-- Only create triggers for tables that definitely have updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Temporarily disable food_tickets trigger until we fix the column issue
-- CREATE TRIGGER update_food_tickets_updated_at BEFORE UPDATE ON food_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_requests_updated_at BEFORE UPDATE ON delivery_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_money_donations_updated_at BEFORE UPDATE ON money_donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at column to food_tickets if it doesn't exist
ALTER TABLE food_tickets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Disable Row Level Security for testing (you can enable it later with proper policies)
ALTER TABLE food_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE money_donations DISABLE ROW LEVEL SECURITY;

-- Sample data removed - database will start clean
-- Food tickets will be created through the application interface