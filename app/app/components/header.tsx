"use client";
import { Music } from "lucide-react";
import Link from "next/link";
import { Redirect } from "./redirect";
import Login from "./login";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a skeleton loader
  }


  return (
    <div className="px-6 h-16 flex items-center bg-gray-900 border-b border-gray-800">
      <Link href="/" className="flex items-center gap-2">
        <Music className="h-6 w-6 text-purple-400" />
        <span className="font-bold text-white text-xl">Muzi</span>
      </Link>

      <nav className="ml-auto flex items-center gap-4">
        {session?.user ? (
          <p className="text-white">{session.user.name || session.user.email}</p>
        ) : (
          ""
        )}

        <Login />
        <Redirect />
      </nav>
    </div>
  );
}
