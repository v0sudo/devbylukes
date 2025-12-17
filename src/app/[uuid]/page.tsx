import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { EditDeveloperForm } from "@/components/edit-developer-form";

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

async function getDeveloperByUuid(
  uuid: string,
): Promise<DeveloperWithProjects | null> {
  try {
    const developer = await db.developer.findUnique({
      where: { editUuid: uuid },
    });
    if (!developer) return null;
    
    return {
      ...developer,
      notableProjects:
        (developer.notableProjects as Array<{ name: string; url: string }> | null) ??
        null,
    } as DeveloperWithProjects;
  } catch (error) {
    console.error("Error fetching developer:", error);
    return null;
  }
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const developer = await getDeveloperByUuid(uuid);

  if (!developer?.editUuid) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Edit Your Profile
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Update your information on Dev By Lukes
            </p>
          </div>
          <EditDeveloperForm developer={developer} />
        </div>
      </div>
    </main>
  );
}

