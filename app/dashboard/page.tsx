"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { create_user } from "../actions/actions";

const DashboardPage: React.FC = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    const createUser = async () => {
      try {
        const the_user = {
          clerkId: user.id,
          email: user?.emailAddresses?.[0]?.emailAddress ?? "",
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
        };
        const response = await create_user(the_user);
        console.log(response);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

    createUser();
  }, [user, isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <div>DashboardPage</div>;
};

export default DashboardPage;
