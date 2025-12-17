"use client";

import { useState } from "react";
import Image from "next/image";
import { Github, Twitter, Globe, User, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditVerificationModal } from "@/components/edit-verification-modal";

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

function getFaviconUrl(url: string): string {
  url = url.replace(/^https?:\/\//, "");
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=https://${domain}&sz=32`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=https://${url}&sz=32`;
  }
}

export function DeveloperCard({ developer }: { developer: Developer }) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center gap-4">
          {developer.avatar ? (
            <Image
              src={developer.avatar}
              alt={developer.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
              <User className="h-8 w-8 text-neutral-400" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {developer.name}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditModal(true)}
            className="shrink-0"
            title="Edit profile"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        {developer.description && (
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            {developer.description}
          </p>
        )}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {developer.twitter && (
              <a
                href={`https://twitter.com/${developer.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-600 transition-colors hover:text-blue-500 dark:text-neutral-400 dark:hover:text-blue-400"
              >
                <Twitter className="h-4 w-4" />
                <span>{developer.twitter}</span>
              </a>
            )}
            {developer.github && (
              <a
                href={`https://github.com/${developer.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <Github className="h-4 w-4" />
                <span>{developer.github}</span>
              </a>
            )}
            {developer.website && (
              <a
                href={
                  developer.website + "?utm_source=devbylukes&ref=devbylukes"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                <Globe className="h-4 w-4" />
                <span>Website</span>
              </a>
            )}
          </div>
          {developer.notableProjects &&
            developer.notableProjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {developer.notableProjects.map((project, index) => (
                  <a
                    key={index}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <Image
                      src={getFaviconUrl(project.url)}
                      alt={project.name}
                      width={16}
                      height={16}
                      className="h-4 w-4"
                      unoptimized
                    />
                    <span>{project.name}</span>
                  </a>
                ))}
              </div>
            )}
        </div>
      </div>

      <EditVerificationModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        developerId={developer.id}
        correctUuid={developer.editUuid}
      />
    </>
  );
}
