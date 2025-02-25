"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { create_user, getLoans } from "../actions/actions";
import { PieChart, Pie, Label, Tooltip } from "recharts";
import CustomLoader from "@/components/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Loan = {
  id: string;
  title: string;
  amount: number;
  interestRate: number;
  status: string;
  createdAt: string;
};

const DashboardPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

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

    async function fetchLoans() {
      try {
        const fetchedLoans = await getLoans({
          clerkId: user!.id,
          email: "",
          firstName: "",
          lastName: "",
        });
        setLoans(
          fetchedLoans.map((loan) => ({
            ...loan,
            createdAt: loan.createdAt.toString(),
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    createUser();
    fetchLoans();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-start h-full w-full">
        <CustomLoader />
      </div>
    );
  }

  // Convert loan data for PieChart
  const chartData = loans.map((loan, index) => ({
    name: loan.title,
    value: loan.amount,
    fill: `hsl(${(index * 80) % 360}, 70%, 50%)`, // Generates unique colors
  }));

  // Calculate total loan amount
  const totalAmount = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h2 className="text-xl font-bold">Loan Distribution</h2>
      <p className="text-gray-500">
        Visual representation of your loan amounts
      </p>

      {loans.length > 0 ? (
        <>
          <PieChart width={450} height={450}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={100}
              outerRadius={150}
              fill="#8884d8"
              paddingAngle={5}
              strokeWidth={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-lg font-bold"
                      >
                        <tspan x={viewBox.cx} y={viewBox.cy}>
                          {totalAmount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-sm"
                        >
                          Total Loans
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <Tooltip />
          </PieChart>
          <Button asChild variant={"outline"}>
            <Link href={"/dashboard/loans"}>View Loans</Link>
          </Button>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center mt-10">
          <p>No loans found</p>
          <p className="mt-5 text-xs tracking-wider text-gray-500">
            Click here to apply for your first loan
          </p>
          <Button asChild variant={"outline"}>
            <Link href={"/dashboard/apply"}>Apply</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
