import { prismaClient } from "@/app/lib/db";
import { YT_REGEX } from "@/app/lib/reg";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";


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
        // console.log("Extracted video ID:", extractedId);

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
        // console.log("YouTube Video Data:", ytData);

        // Extract video details safely
        const video = ytData.items?.[0];
        const title = video?.snippet?.title || "Untitled";
        const SmallImg = video?.snippet?.thumbnails?.standard?.url || "";
        const bigImg = video?.snippet?.thumbnails?.maxres?.url || "";

        // console.log("title and thumbnail", SmallImg, bigImg, title)
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
                title: title,
                type: "Youtube",
                smallImg: SmallImg,
                bigImg: bigImg,
            },
        });

        return NextResponse.json({
            message: "Added stream",
            id: stream.id,
            song: {
                ...stream,
                upvotes: 0,           // new stream has 0 upvotes
                haveUpvoted: false    // user hasn't upvoted yet
              }
             // Return fetched title for client use
        });
    } catch (error) {
        console.error("Error in POST /stream:", error);
        return NextResponse.json(
            { message: "Error while adding a stream" },
            { status: 500 }
        );
    }
}

// export async function GET(req: NextRequest) {
//     try {
//         const creatorId = req.nextUrl.searchParams.get("creatorId");

//         if(!creatorId){
//             return NextResponse.json({
//                 message: "Error"
//             },{
//                 status:403
//             })
//         }

//         const [streams,activeStream] = await Promise.all([prismaClient.stream.findMany({
//             where: {
//                 userId: creatorId,
//                 played: false
//             },
//             include: {
//                 _count: {
//                     select: {
//                         upvotes: true
//                     }
//                 },
//                 upvotes: {
//                     where: {
//                         userId: creatorId
//                     }
//                 }
//             }
//         }),prismaClient.currentStream.findFirst({
//             where: {
//                 userId: creatorId
//             },
//             include: {
//                 stream:true
//             }
//         })
//         ])
    
//         return NextResponse.json({
//             streams: streams.map(({ _count, upvotes, ...rest }) => ({
//                 ...rest,
//                 upvotes: _count.upvotes,
//                 haveUpvoted: upvotes.length ? true : false
//             })),
//             activeStream
//           });
//     } catch (error) {
//         console.error("Error in GET /stream:", error);
//         return NextResponse.json(
//             { message: "Failed to fetch streams" },
//             { status: 500 }
//         );
//     }
// }
const streamWithCountAndUpvotes = Prisma.validator<Prisma.StreamDefaultArgs>()({
    include: {
      _count: {
        select: { upvotes: true },
      },
      upvotes: true,
    },
  });
  
  type StreamWithExtras = Prisma.StreamGetPayload<typeof streamWithCountAndUpvotes>;
  
  // Define type for currentStream with stream included
  const currentStreamWithStream = Prisma.validator<Prisma.CurrentStreamDefaultArgs>()({
    include: {
      stream: true,
    },
  });
  
  type CurrentStreamWithStream = Prisma.CurrentStreamGetPayload<typeof currentStreamWithStream>;
  
  export async function GET(req: NextRequest) {
    try {
      const creatorId = req.nextUrl.searchParams.get("creatorId");
  
      if (!creatorId) {
        return NextResponse.json(
          {
            message: "Error: Missing creatorId",
          },
          {
            status: 403,
          }
        );
      }
  
      const [streams, activeStream]: [StreamWithExtras[], CurrentStreamWithStream | null] =
        await Promise.all([
          prismaClient.stream.findMany({
            where: {
              userId: creatorId,
              played: false,
            },
            include: {
              _count: {
                select: {
                  upvotes: true,
                },
              },
              upvotes: {
                where: {
                  userId: creatorId,
                },
              },
            },
          }),
          prismaClient.currentStream.findFirst({
            where: {
              userId: creatorId,
            },
            include: {
              stream: true,
            },
          }),
        ]);
  
      return NextResponse.json({
        streams: streams.map(({ _count, upvotes, ...rest }) => ({
          ...rest,
          upvotes: _count.upvotes,
          haveUpvoted: upvotes.length > 0,
        })),
        activeStream,
      });
    } catch (error) {
      console.error("Error in GET /stream:", error);
      return NextResponse.json(
        { message: "Failed to fetch streams" },
        { status: 500 }
      );
    }
  }
  