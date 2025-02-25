"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLoans } from "@/app/actions/actions";
import { useUser } from "@clerk/nextjs";
import CustomLoader from "@/components/loader";
import Link from "next/link";

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

      {loans.length === 0 ? (
        <div className="flex flex-col gap-3 justify-center items-center">
          <p>No loans found.</p>
          <Button asChild variant={"outline"}>
            <Link href={"/dashboard/apply"}>Apply for Loan</Link>
          </Button>
        </div>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Interest Rate</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="border-b">
                <td className="p-3">{loan.title}</td>
                <td className="p-3">R{loan.amount.toFixed(2)}</td>
                <td className="p-3">{loan.interestRate}%</td>
                <td className="p-3">
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
                </td>
                <td className="p-3">
                  <Button onClick={() => router.push(`/dashboard/loans/loan`)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
