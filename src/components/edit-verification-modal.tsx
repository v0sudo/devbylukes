"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditVerificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  developerId: number;
  correctUuid: string | null;
};

export function EditVerificationModal({
  open,
  onOpenChange,
  developerId: _developerId,
  correctUuid,
}: EditVerificationModalProps) {
  const router = useRouter();
  const [uuid, setUuid] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!uuid.trim()) {
      setError("Please enter your edit UUID");
      return;
    }

    // Verify the UUID matches
    if (uuid.trim() !== correctUuid) {
      setError("Invalid UUID. Please check and try again.");
      return;
    }

    // UUID matches, redirect to edit page
    router.push(`/${correctUuid}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Verify Edit Access</DialogTitle>
          <DialogDescription>
            Enter your edit UUID to modify this profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="uuid">Edit UUID</Label>
              <Input
                id="uuid"
                placeholder="Enter your edit UUID"
                value={uuid}
                onChange={(e) => {
                  setUuid(e.target.value);
                  setError("");
                }}
                className="font-mono text-sm"
              />
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setUuid("");
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Verify & Edit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

