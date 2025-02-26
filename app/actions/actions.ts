"use server";

import { prisma } from "@/lib/db";

interface User {
  clerkId: string;
  email: string | "";
  firstName: string | "";
  lastName: string | "";
}


// Create user in DB
export async function create_user(the_user: User) {
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

export async function getLoans(user_id: User) {
  
    if (!user_id) {
      throw new Error("Unauthorized");
    }
  
    try {
      const loans = await prisma.loan.findMany({
        where: { user: { clerkId: user_id.clerkId } },
        orderBy: { createdAt: "desc" },
      });
  
      // Convert Decimal to number
      return loans.map((loan) => ({
        ...loan,
        amount: Number(loan.amount), // Convert Prisma Decimal to number
        interestRate: Number(loan.interestRate), // Convert Prisma Decimal to number
      }));
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw new Error("Failed to fetch loans");
    }
  }

// Apply for loan
export async function applyForLoan(clerkId: string, title: string, amount: number) {
  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const status = () => {
      // Randomly choose between approved and rejected and pending
      const statuses = ["approved", "rejected", "pending"];
      return statuses[Math.floor(Math.random() * statuses.length)];
    }

    // make the interest rate random between 5% - 21%
    const interestRate = Math.floor(Math.random() * 16) + 5;

    const newLoan = await prisma.loan.create({
      data: {
        title,
        amount,
        interestRate,
        status: status(), // Always approved
        userId: user.id,
      },
    });

    return JSON.parse(JSON.stringify(newLoan)); // Return a plain object
  } catch (error) {
    console.error("Error creating loan:", error);
    return { error: "Failed to apply for loan" };
  }
}
