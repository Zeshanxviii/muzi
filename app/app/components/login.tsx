"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Login(){
    const session = useSession()
    return(
        <div>
            {session.data?.user&&<Link href="/"><button onClick={()=>(signOut())}>Signout</button></Link>}
            {!session.data?.user&&<button>Signin</button>}
         </div>
    )
}