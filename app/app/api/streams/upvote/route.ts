import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Unauthenticated" },
      { status: 403 }
    );
  }

  // Fetch user once if you don't have userId in session
  const user = await prismaClient.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  try {
    const data = UpvoteSchema.parse(await req.json());

    // Check if upvote exists
    const existingUpvote = await prismaClient.upvote.findFirst({
      where: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    if (existingUpvote) {
      // If you want to **toggle** (remove upvote if exists), uncomment below:
      // await prismaClient.upvote.delete({
      //   where: { id: existingUpvote.id },
      // });
      // return NextResponse.json({ message: "Upvote removed" });

      // If you want to **reject duplicate upvote**, return error
      return NextResponse.json(
        { message: "Already upvoted" },
        { status: 400 }
      );
    }

    // Create upvote
    await prismaClient.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    return NextResponse.json({ message: "Upvote added" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error while upvoting" },
      { status: 500 }
    );
  }
}
