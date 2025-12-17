"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Copy, Check } from "lucide-react";
import { ProjectsInput } from "@/components/projects-input";

export function AddDeveloperModal() {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editUuid, setEditUuid] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    twitter: "",
    github: "",
    website: "",
    description: "",
    notableProjects: [] as Array<{ name: string; url: string }>,
  });

  // Generate avatar URL from Twitter handle
  const avatarUrl = useMemo(() => {
    if (!formData.twitter) return null;
    const handle = formData.twitter.replace(/^@/, "").trim();
    if (!handle) return null;
    return `https://unavatar.io/x/${handle}`;
  }, [formData.twitter]);

  const [duplicateError, setDuplicateError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(false);
    try {
      const response = await fetch("/api/developers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };

        // Handle duplicate X handle error
        if (
          response.status === 409 &&
          errorData.error === "DUPLICATE_X_HANDLE"
        ) {
          setDuplicateError(true);
          return;
        }

        throw new Error(
          errorData.error ??
            errorData.message ??
            `Failed to submit: ${response.status}`,
        );
      }

      const developer = (await response.json()) as { editUuid: string };
      setEditUuid(developer.editUuid);
      setOpen(false);
      setShowSuccess(true);
      // Reset form
      setFormData({
        name: "",
        twitter: "",
        github: "",
        website: "",
        description: "",
        notableProjects: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) {
            setDuplicateError(false);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button>Add a Luke</Button>
        </DialogTrigger>
        <DialogContent
          className="max-h-[80dvh] overflow-y-auto sm:max-h-none sm:max-w-[500px]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add a Luke</DialogTitle>
            <DialogDescription>
              Fill in your details to add a Luke to Dev By Lukes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Luke Skywalker"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="twitter">X (Twitter) Handle</Label>
                {duplicateError && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <p className="font-medium">
                      This X handle is already registered!
                    </p>
                    <p className="mt-1">
                      Please use the edit button on your profile card to update
                      your information.
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Input
                    id="twitter"
                    placeholder="v0sudo"
                    value={formData.twitter}
                    onChange={(e) => {
                      setFormData({ ...formData, twitter: e.target.value });
                      setDuplicateError(false);
                    }}
                    className="flex-1"
                  />
                  {avatarUrl && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-neutral-200 dark:border-neutral-800">
                      <Image
                        src={avatarUrl}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  {!avatarUrl && formData.twitter && (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
                      <User className="h-6 w-6 text-neutral-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="lukeskywalker"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://lukeskywalker.dev"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about yourself..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <ProjectsInput
                projects={formData.notableProjects}
                onChange={(projects) =>
                  setFormData({ ...formData, notableProjects: projects })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setDuplicateError(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Successfully Added!</DialogTitle>
            <DialogDescription>
              Your profile has been added to Dev By Lukes. Save your edit link
              to update your profile later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <Label>Your Edit UUID (Save this!)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={editUuid ?? ""}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (editUuid) {
                      void copyToClipboard(editUuid);
                    }
                  }}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Use this UUID with the edit button on your profile card to edit
                your information. Keep it safe!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccess(false);
                window.location.reload();
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
