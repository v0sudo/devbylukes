"use client";

import { useState, useMemo } from "react";
import { DeveloperCard } from "@/components/developer-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AddDeveloperModal } from "./add-developer-modal";
import { ModeToggle } from "./toggle-theme";

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

export function DevelopersList({ developers }: { developers: Developer[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevelopers = useMemo(() => {
    if (!searchQuery.trim()) {
      return developers;
    }

    const query = searchQuery.toLowerCase().trim();
    return developers.filter((dev) => {
      if (!dev.twitter) return false;
      const handle = dev.twitter.replace(/^@/, "").toLowerCase();
      return handle.includes(query);
    });
  }, [developers, searchQuery]);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <AddDeveloperModal />
        <div className="relative w-lg max-w-xl">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by X handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <ModeToggle />
      </div>

      {/* Developers Grid */}
      {filteredDevelopers.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-neutral-600 dark:text-neutral-400">
            {searchQuery
              ? `No developers found matching "${searchQuery}"`
              : "No developers added yet. Be the first!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevelopers.map((dev) => (
            <DeveloperCard key={dev.id} developer={dev} />
          ))}
        </div>
      )}
    </>
  );
}
