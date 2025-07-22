import StreamView from "@/app/components/StreamView"

export default function Page({
    params: {
        creatorId
    }
}: {
    params: {
        creatorId: String
    }
}){
    return(
        <>
            <StreamView creatorId={creatorId} playVideo={false}/>
        </>
    )
}