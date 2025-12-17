import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

function normalizeTwitterHandle(twitter: string | null): string | null {
  if (!twitter) return null;
  return twitter.replace(/^@/, "").trim().toLowerCase() || null;
}

function getAvatarUrl(twitterHandle: string | null): string | null {
  if (!twitterHandle) return null;
  // Remove @ if present and trim whitespace
  const handle = twitterHandle.replace(/^@/, "").trim();
  if (!handle) return null;
  // Use unavatar.io/x/{username} format
  return `https://unavatar.io/x/${handle}`;
}

type CreateDeveloperBody = {
  name: string;
  twitter?: string | null;
  github?: string | null;
  website?: string | null;
  description?: string | null;
  notableProjects?: Array<{ name: string; url: string }>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateDeveloperBody;
    const { name, twitter, github, website, description, notableProjects } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validate notable projects limit
    if (notableProjects && Array.isArray(notableProjects) && notableProjects.length > 2) {
      return NextResponse.json(
        { error: "Maximum of 2 notable projects allowed" },
        { status: 400 },
      );
    }

    // Check if X handle already exists (case-insensitive, without @)
    if (twitter) {
      const normalizedHandle = normalizeTwitterHandle(twitter);
      if (normalizedHandle) {
        // Get all developers with Twitter handles
        const allDevelopers = await db.developer.findMany({
          where: {
            twitter: {
              not: null,
            },
          },
        });

        // Check if any existing developer has the same normalized handle
        const duplicate = allDevelopers.find((dev) => {
          if (!dev.twitter) return false;
          return normalizeTwitterHandle(dev.twitter) === normalizedHandle;
        });

        if (duplicate) {
          return NextResponse.json(
            {
              error: "DUPLICATE_X_HANDLE",
              message:
                "This X handle has already been added. Please use the edit button on your profile card to update your information.",
            },
            { status: 409 },
          );
        }
      }
    }

    // Get avatar URL from Twitter handle
    const avatar = getAvatarUrl(twitter ?? null);
    // Generate unique edit UUID
    const editUuid = randomUUID();

    const developer = await db.developer.create({
      data: {
        name,
        twitter: twitter ?? null,
        github: github ?? null,
        website: website ?? null,
        description: description ?? null,
        avatar: avatar,
        notableProjects: notableProjects ?? [],
        editUuid: editUuid,
      },
    });

    return NextResponse.json(developer, { status: 201 });
  } catch (error) {
    console.error("Error creating developer:", error);
    return NextResponse.json(
      { error: "Failed to create developer" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const developers = await db.developer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(developers);
  } catch (error) {
    console.error("Error fetching developers:", error);
    return NextResponse.json(
      { error: "Failed to fetch developers" },
      { status: 500 },
    );
  }
}
