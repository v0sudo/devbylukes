import { db } from "@/server/db";
import { DevelopersList } from "@/components/developers-list";
import Link from "next/link";
import { Github } from "lucide-react";

type DeveloperWithProjects = {
  id: number;
  name: string;
  twitter: string | null;
  github: string | null;
  website: string | null;
  description: string | null;
  avatar: string | null;
  notableProjects: Array<{ name: string; url: string }> | null;
  editUuid: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Disable caching to ensure fresh data on every request
export const revalidate = 0;

async function getDevelopers(): Promise<DeveloperWithProjects[]> {
  const developers = await db.developer.findMany({
    orderBy: { id: "asc" },
  });

  // Type cast notableProjects from JsonValue to the expected type
  return developers.map((dev) => ({
    ...dev,
    notableProjects:
      (dev.notableProjects as Array<{ name: string; url: string }> | null) ??
      null,
  })) as DeveloperWithProjects[];
}

export default async function HomePage() {
  const developers = await getDevelopers();

  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Built by Credit */}
          <div className="mb-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Built by{" "}
              <Link
                href="https://twitter.com/CodeWizard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-neutral-900 transition-colors hover:text-blue-500 dark:text-neutral-100 dark:hover:text-blue-400"
              >
                @CodeWizard
              </Link>{" "}
              on X <span className="mx-3">/</span> Edit this page on{" "}
              <Link
                href="https://github.com/v0sudo/devbylukes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-neutral-900 transition-colors hover:text-blue-500 dark:text-neutral-100 dark:hover:text-blue-400"
              >
                GitHub
              </Link>
            </p>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-100">
              Dev By Lukes
            </h1>
            <p className="mb-4 text-lg text-neutral-600 dark:text-neutral-400">
              Showcasing developers named Luke from around the world
            </p>
          </div>

          {/* Developers List with Search */}
          <DevelopersList developers={developers} />
        </div>
      </div>
    </main>
  );
}
