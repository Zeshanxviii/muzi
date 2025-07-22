
import StreamView from "../components/StreamView"

const creatorId = "aa5e8d75-7655-4a92-839d-a469e5c82897"

export default function Dashboard(){
  return(
    <div>
    < StreamView creatorId={creatorId} playVideo={true} />
    </div>
  )
}
