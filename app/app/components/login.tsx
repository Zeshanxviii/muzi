"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Login() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a placeholder loader if needed
  }

  if (status === "loading") {
    return (
      <Button disabled className="bg-gray-600 text-white">
        Loading...
      </Button>
    );
  }

  return session?.user ? (
    <Button
      onClick={() => signOut()}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      Sign out
    </Button>
  ) : (
    <Link href="/login">
      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
        Sign in
      </Button>
    </Link>
  );
}
