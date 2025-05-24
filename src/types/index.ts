export type OrgDeliveryCapability = "self-delivery" | "accepts-requests" | "none" | "factory-only";
export type DeliveryMethod = "self-pickup" | "organization-delivery" | "shipping" | "factory-delivery";
export type UserRole = "guest" | "charity" | "organization" | "admin" | "factory";
export type OrganizationType = "restaurant" | "hotel" | "supermarket" | "shelter" | "other";
export type CharityType = "charity" | "restaurant" | "hotel" | "supermarket" | "other";
export type FoodCategory = "prepared" | "produce" | "bakery" | "dairy" | "meat" | "other";
export type CharityCategory = "homeless" | "children" | "animal" | "elderly" | "foodbank" | "factory";

export interface FoodTicket {
  id: string;
  organizationId: string;
  organizationName: string;
  foodType: string;
  category: FoodCategory;
  weight: number;
  pieces?: number;
  expiryDate: string;
  notes?: string;
  createdAt: string;
  status: "pending" | "accepted" | "declined" | "expired" | "converted";
  acceptedBy?: string;
  deliveryCapability?: OrgDeliveryCapability;
  orgDeliveryStatus?: "pending" | "accepted" | "declined";
  isExpired?: boolean;
  factoryId?: string;
  factoryName?: string;
  conversionStatus?: "pending" | "converted" | "rejected";
  pickupLocation?: string;
  preferredPickupFrom?: string;
  preferredPickupTo?: string;
}

export interface Charity {
  id: string;
  name: string;
  description?: string;
  type: CharityType;
  category: CharityCategory;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  image?: string;
}

export interface Hotel {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
}

export interface Collaboration {
  id: string;
  ticketId: string;
  charityId: string;
  charityName: string;
  organizationId: string;
  organizationName: string;
  foodDetails: string;
  date: string;
  deliveryMethod: DeliveryMethod;
}

export interface Factory {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  coverageArea?: string[];
}
