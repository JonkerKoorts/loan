"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { create_user, getLoans } from "../actions/actions";
import { CartesianGrid, Line, LineChart, XAxis, Tooltip } from "recharts";
import CustomLoader from "@/components/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import searching from "../../public/animations/searching.json";
import dynamic from "next/dynamic";

type Loan = {
  id: string;
  title: string;
  amount: number;
  interestRate: number;
  status: string;
  createdAt: string;
};

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div style={{ width: 200, height: 200 }}></div>,
});

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
        // Convert createdAt to a string for our front-end type
        setLoans(
          fetchedLoans.map((loan) => ({
            ...loan,
            createdAt: new Date(loan.createdAt).toISOString(),
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

  if (loans.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <Lottie animationData={searching} style={{ width: 200, height: 200 }} />
        <p>No loans found</p>
        <p className="my-5 text-xs tracking-wider text-gray-500">
          Click here to apply for your first loan
        </p>
        <Button asChild variant={"outline"}>
          <Link href={"/dashboard/apply"}>Apply</Link>
        </Button>
      </div>
    );
  }

  // Generate chart data spanning at least one month
  const generateChartData = () => {
    // Sort loans by date first
    const sortedLoans = [...loans].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Find earliest and latest dates in the loans data
    const earliestDate = new Date(sortedLoans[0].createdAt);
    const latestDate = new Date(sortedLoans[sortedLoans.length - 1].createdAt);

    // Ensure we're covering at least a month
    let startDate = new Date(earliestDate);
    let endDate = new Date(latestDate);

    // If the date range is less than a month, extend to make it a full month
    if (endDate.getTime() - startDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
      // Set end date to be at least 30 days after start date
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);

      // If end date is in the future, adjust to make end date today
      const today = new Date();
      if (endDate > today) {
        endDate = today;
        // And adjust start date to be 30 days before today
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
      }
    }

    // Generate an array of dates between start and end dates
    const dateArray = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create data points for each date
    return dateArray.map((date) => {
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Find loans that match this date
      const matchingLoans = loans.filter((loan) => {
        const loanDate = new Date(loan.createdAt);
        return loanDate.toDateString() === date.toDateString();
      });

      // Calculate totals for each status
      const approved = matchingLoans
        .filter((loan) => loan.status === "approved")
        .reduce((sum, loan) => sum + loan.amount, 0);

      const rejected = matchingLoans
        .filter((loan) => loan.status === "rejected")
        .reduce((sum, loan) => sum + loan.amount, 0);

      const pending = matchingLoans
        .filter((loan) => loan.status === "pending")
        .reduce((sum, loan) => sum + loan.amount, 0);

      return {
        date: formattedDate,
        fullDate: date, // Store full date for sorting
        approved,
        rejected,
        pending,
      };
    });
  };

  // Generate chart data with at least a month period
  const fullChartData = generateChartData();

  // We need to display dates at regular intervals if there are too many
  const displayEveryNth = Math.ceil(fullChartData.length / 10); // Show ~10 tick marks

  // Filter the data for display (we're not removing data points, just formatting x-axis)
  const chartData = fullChartData.map((point, index) => ({
    ...point,
    // Only show label on every Nth point to avoid overcrowding
    date: index % displayEveryNth === 0 ? point.date : "",
  }));

  // ChartConfig for three statuses
  const chartConfig = {
    approved: {
      label: "Approved",
      color: "hsl(var(--chart-1))",
    },
    rejected: {
      label: "Rejected",
      color: "hsl(var(--chart-2))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Loan Distribution</h2>
      <p className="text-gray-500">
        Visual representation of your loan amounts (30-day minimum period)
      </p>

      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0} // Force it to use our custom interval logic
          />
          <Tooltip
            content={<ChartTooltipContent />}
            labelFormatter={(label, items) => {
              // Find the actual item so we can get the full date
              const dataPoint = items[0]?.payload;
              if (dataPoint && dataPoint.fullDate) {
                return dataPoint.fullDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }
              return label;
            }}
          />
          <Line
            dataKey="approved"
            type="monotone"
            stroke="var(--color-approved)"
            strokeWidth={2}
            dot
          />
          <Line
            dataKey="rejected"
            type="monotone"
            stroke="var(--color-rejected)"
            strokeWidth={2}
            dot
          />
          <Line
            dataKey="pending"
            type="monotone"
            stroke="var(--color-pending)"
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ChartContainer>

      <div className="flex justify-center mt-4">
        <Button asChild variant={"outline"}>
          <Link href={"/dashboard/loans"}>View Loans</Link>
        </Button>
        <Button asChild variant={"outline"} className="ml-2">
          <Link href={"/dashboard/apply"}>Apply</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
