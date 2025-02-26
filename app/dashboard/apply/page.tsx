"use client";

import { useState } from "react";
import { applyForLoan } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import CustomLoader from "@/components/loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ApplyLoanPage() {
  const { user, isLoaded } = useUser();
  const [amount, setAmount] = useState<number>(1000);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded || !user)
    return (
      <div className="flex justify-center items-start h-full w-full">
        <CustomLoader />
      </div>
    );

  const handleApply = async () => {
    if (!title.trim()) return;

    setLoading(true);
    const response = await applyForLoan(user.id, title, amount);

    if (response?.error) {
      console.error(response.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard/loans"); // Redirect after applying
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Apply for a Loan</h1>
      <p className="text-gray-500">
        Just enter an amount and name to get started. We&apos;ll take care of
        the rest
      </p>

      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700">
          Loan Title
        </Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter loan purpose"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700">
          Loan Amount
        </Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <Button onClick={handleApply} disabled={loading || title.trim() === ""}>
        {loading ? "Processing..." : "Apply for Loan"}
      </Button>
    </div>
  );
}
