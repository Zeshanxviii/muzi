"use client"
import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar () {
    const session = useSession()
    return(
        <div className="flex justify-between">
            <div>
                Mizu
            </div>
            <div>
               {session.data?.user&&<button onClick={()=>(signOut())}>Signout</button>}
               {!session.data?.user&&<button onClick={()=>(signIn())}>Signin</button>}
            </div>
        </div>
    )
}