"use server";
import { prisma } from "@/lib/db";


// Create user in DB
export async function create_user(the_user: any) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: the_user.clerkId },
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser; // Return the existing user instead of creating a new one
    }

    // Create new user if they don't exist
    const newUser = await prisma.user.create({
      data: the_user,
    });

    return JSON.parse(JSON.stringify(newUser)); // Ensure it's a plain object
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}
