"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLoans } from "@/app/actions/actions";
import { useUser } from "@clerk/nextjs";
import CustomLoader from "@/components/loader";
import Link from "next/link";
import Lottie from "lottie-react";
import searching from "../../../public/animations/searching.json";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Loan = {
  id: string;
  title: string;
  amount: number;
  interestRate: number;
  status: string;
  createdAt: string;
};

export default function LoanListPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    else {
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
      fetchLoans();
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-start h-full w-full">
        <CustomLoader />
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Loans</h1>
      <p className="text-gray-500">Looking clean</p>

      {loans.length === 0 ? (
        <div className="flex flex-col justify-center items-center mt-10">
          <Lottie
            animationData={searching}
            style={{ width: 200, height: 200 }}
          />
          <p>No loans found</p>
          <p className="my-5 text-xs tracking-wider text-gray-500">
            Click here to apply for your first loan
          </p>
          <Button asChild variant={"outline"}>
            <Link href={"/dashboard/apply"}>Apply</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your recent loan activity.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.title}</TableCell>
                <TableCell>R{loan.amount.toFixed(2)}</TableCell>
                <TableCell>{loan.interestRate}%</TableCell>
                <TableCell>
                  {" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      loan.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : loan.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {loan.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => router.push(`/dashboard/loans/loan`)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
