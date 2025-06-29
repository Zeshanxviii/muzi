import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string(), // YouTube URL
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = createStreamSchema.parse(body);

        const match = parsed.url.match(YT_REGEX);
        if (!match) {
            return NextResponse.json(
                { message: "Wrong URL format" },
                { status: 411 }
            );
        }

        const extractedId = match[1];
        console.log("Extracted video ID:", extractedId);

        const API_KEY = process.env.YT_API_KEY;
        const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${extractedId}&key=${API_KEY}`;

        const ytRes = await fetch(ytUrl);
        if (!ytRes.ok) {
            console.error("YouTube API error:", ytRes.status, await ytRes.text());
            return NextResponse.json(
                { message: "Failed to fetch video details" },
                { status: 500 }
            );
        }

        const ytData = await ytRes.json();
        console.log("YouTube Video Data:", ytData);

        // Extract video details safely
        const video = ytData.items?.[0];
        const title = video?.snippet?.title || "Untitled";
        const thumbnail = video?.snippet?.thumbnails?.default?.url || "";

        console.log("title and thumbnail", thumbnail, title)
        // Check if user exists
        const user = await prismaClient.user.findUnique({
            where: { id: parsed.creatorId },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Creator not found" },
                { status: 404 }
            );
        }


        const stream = await prismaClient.stream.create({
            data: {
                userId: parsed.creatorId,
                url: parsed.url,
                extractedId,
                type: "Youtube",
                // Uncomment these fields if you have them in your schema:
                // title,
                // thumbnail,
            },
        });

        return NextResponse.json({
            message: "Added stream",
            id: stream.id,
            title, // Return fetched title for client use
        });
    } catch (error) {
        console.error("Error in POST /stream:", error);
        return NextResponse.json(
            { message: "Error while adding a stream" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const creatorId = req.nextUrl.searchParams.get("creator") || "";

        const streams = await prismaClient.stream.findMany({
            where: {
                userId: creatorId,
            },
        });

        return NextResponse.json({ streams });
    } catch (error) {
        console.error("Error in GET /stream:", error);
        return NextResponse.json(
            { message: "Failed to fetch streams" },
            { status: 500 }
        );
    }
}
