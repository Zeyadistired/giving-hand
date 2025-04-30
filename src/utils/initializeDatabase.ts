
// This file initializes the database with mock data
import { Factory, FoodTicket } from "@/types";
import { factories } from "@/data/factories";



interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  password: string;
  type: string;
}

export const initializeDatabase = () => {
  // Only initialize once if storage is empty
  // Check if the database needs to be initialized
  if (localStorage.getItem("dbInitialized") === "false" && 
      JSON.parse(localStorage.getItem("initialDatabase") || "[]").length > 0) {
    return;
  }

  console.log("Initializing database...");
  
  // Initial users
  const initialUsers: User[] = [
    {
      id: "org1",
      name: "Gourmet Palace Hotel",
      email: "hotel@example.com",
      username: "gourmethotel",
      password: "Password123",
      type: "organization"
    },
    {
      id: "char1",
      name: "Hope Shelter",
      email: "charity@example.com",
      username: "hopeshelter",
      password: "Password123",
      type: "charity"
    },
    {
      id: "admin1",
      name: "System Administrator",
      email: "eui@admin.com",
      username: "admin",
      password: "admin@123",
      type: "admin"
    },
    {
      id: "fac1",
      name: "Evergrow for Specialized Fertilizers",
      email: "factory@example.com",
      username: "evergrow",
      password: "Password123",
      type: "factory"
    }
  ];

  // Add factory users from our data
  const factoryUsers: User[] = factories.map(factory => ({
    id: factory.id,
    name: factory.name,
    email: factory.email || `${factory.id.toLowerCase()}@example.com`,
    username: factory.name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 15),
    password: "Password123",
    type: "factory"
  }));

  // Sample food tickets
  const initialFoodTickets: FoodTicket[] = [
    {
      id: "ticket1",
      organizationId: "org1",
      organizationName: "Gourmet Palace Hotel",
      foodType: "Leftover Buffet Items",
      category: "prepared",
      weight: 5.2,
      pieces: 12,
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      notes: "Various dishes from dinner buffet, all properly packaged",
      createdAt: new Date().toISOString(),
      status: "pending"
    },
    {
      id: "ticket2",
      organizationId: "org1",
      organizationName: "Gourmet Palace Hotel",
      foodType: "Expired Dairy Products",
      category: "dairy",
      weight: 3.7,
      pieces: 15,
      expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (expired)
      notes: "Milk, yogurt, and cheese slightly past expiration",
      createdAt: new Date().toISOString(),
      status: "expired",
      isExpired: true,
      deliveryCapability: "factory-only",
      factoryId: "FAC0004",
      factoryName: "Evergrow for Specialized Fertilizers",
      conversionStatus: "pending"
    },
    {
      id: "ticket3",
      organizationId: "org1",
      organizationName: "Gourmet Palace Hotel",
      foodType: "Bread and Pastries",
      category: "bakery",
      weight: 2.5,
      pieces: 30,
      expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (expired)
      notes: "Day-old bread and pastries, still edible but not fresh",
      createdAt: new Date().toISOString(),
      status: "expired",
      isExpired: true,
      deliveryCapability: "factory-only",
      factoryId: "FAC0001",
      factoryName: "Abu Qir Fertilizers and Chemicals Industries",
      conversionStatus: "converted"
    }
  ];

  // Save to localStorage
  localStorage.setItem("initialDatabase", JSON.stringify([...initialUsers, ...factoryUsers]));
  
  // Only set food tickets if they don't exist yet
  if (!localStorage.getItem("foodTickets")) {
    localStorage.setItem("foodTickets", JSON.stringify(initialFoodTickets));
  }
  
  localStorage.setItem("dbInitialized", "true");
  console.log("Database initialized successfully");
};
