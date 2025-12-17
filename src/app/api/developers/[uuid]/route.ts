import { db } from "@/server/db";
import { NextResponse } from "next/server";

function getAvatarUrl(twitterHandle: string | null): string | null {
  if (!twitterHandle) return null;
  // Remove @ if present and trim whitespace
  const handle = twitterHandle.replace(/^@/, "").trim();
  if (!handle) return null;
  // Use unavatar.io/x/{username} format
  return `https://unavatar.io/x/${handle}`;
}

type UpdateDeveloperBody = {
  name: string;
  twitter?: string | null;
  github?: string | null;
  website?: string | null;
  description?: string | null;
  notableProjects?: Array<{ name: string; url: string }>;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const { uuid } = await params;
    const body = (await request.json()) as UpdateDeveloperBody;
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

    // Verify the UUID exists
    const existingDeveloper = await db.developer.findUnique({
      where: { editUuid: uuid },
    });

    if (!existingDeveloper) {
      return NextResponse.json(
        { error: "Developer not found or invalid edit link" },
        { status: 404 },
      );
    }

    // Get avatar URL from Twitter handle
    const avatar = getAvatarUrl(twitter ?? null);

    const developer = await db.developer.update({
      where: { editUuid: uuid },
      data: {
        name,
        twitter: twitter ?? null,
        github: github ?? null,
        website: website ?? null,
        description: description ?? null,
        avatar: avatar,
        notableProjects: notableProjects ?? [],
      },
    });

    return NextResponse.json(developer, { status: 200 });
  } catch (error) {
    console.error("Error updating developer:", error);
    return NextResponse.json(
      { error: "Failed to update developer" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const { uuid } = await params;
    const developer = await db.developer.findUnique({
      where: { editUuid: uuid },
    });

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(developer);
  } catch (error) {
    console.error("Error fetching developer:", error);
    return NextResponse.json(
      { error: "Failed to fetch developer" },
      { status: 500 },
    );
  }
}

