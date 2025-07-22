import StreamView from "@/app/components/StreamView";

interface PageProps {
    params: Promise<{ creatorId: string }>;
}

export default async function Page(props: PageProps) {
    const { creatorId } = await props.params;
    return <StreamView creatorId={creatorId} playVideo={false} />
}
