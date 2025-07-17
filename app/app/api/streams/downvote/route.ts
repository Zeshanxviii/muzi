import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse ,NextRequest } from "next/server";    
import { z } from "zod";

const DownvoteSchema = z.object({
    streamId: z.string(),
})
export async function POST(req: NextRequest) {
    const session = await getServerSession();
    // TODO the place where get rid of the db call here

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
    if (!user?.id) {
        return NextResponse.json({
            message: "Unauthenticated"
        },
            {
                status: 403
            })
    }

    try {
        const data = DownvoteSchema.parse(await req.json())
        await prismaClient.upvote.delete({
            where: {
                userId_streamId: {
                    userId : user?.id,
                    streamId :data.streamId
            }
            }
        })
        return NextResponse.json({
            message:"Done!~"
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            message: "Error while upvoting"
        },{
            status:403
        })
        
    }
}