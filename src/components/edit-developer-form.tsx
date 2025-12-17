"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { ProjectsInput } from "@/components/projects-input";

type Developer = {
  id: number;
  name: string;
  twitter: string | null;
  github: string | null;
  website: string | null;
  description: string | null;
  avatar: string | null;
  notableProjects: Array<{ name: string; url: string }> | null;
  editUuid: string | null;
};

export function EditDeveloperForm({ developer }: { developer: Developer }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: developer.name,
    twitter: developer.twitter ?? "",
    github: developer.github ?? "",
    website: developer.website ?? "",
    description: developer.description ?? "",
    notableProjects: (developer.notableProjects as Array<{ name: string; url: string }>) ?? [],
  });

  // Generate avatar URL from Twitter handle
  const avatarUrl = useMemo(() => {
    if (!formData.twitter) return developer.avatar;
    const handle = formData.twitter.replace(/^@/, "").trim();
    if (!handle) return developer.avatar;
    return `https://unavatar.io/x/${handle}`;
  }, [formData.twitter, developer.avatar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!developer.editUuid) {
        alert("Edit UUID not found. Please contact support.");
        return;
      }

      const response = await fetch(`/api/developers/${developer.editUuid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(
          errorData.error ?? `Failed to update: ${response.status}`,
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error updating form:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
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
            <div className="flex items-center gap-4">
              <Input
                id="twitter"
                placeholder="v0sudo"
                value={formData.twitter}
                onChange={(e) =>
                  setFormData({ ...formData, twitter: e.target.value })
                }
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
              {!avatarUrl && (
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
        <div className="mt-6 flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}

