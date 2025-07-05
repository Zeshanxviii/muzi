"use client"

import { useState } from "react"
import { signIn} from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"



export default function PreRegistrationPage() {
  const [loadingProvider, setLoadingProvider] = useState<null | "google" | "github">(null)

  const handleLogin = async (provider: "google" | "github") => {
    setLoadingProvider(provider)
    await signIn(provider, { callbackUrl: "/" })
    setLoadingProvider(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white font-bold text-center">Muzi</CardTitle>
            <CardDescription className="text-center">A music streaming application</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleLogin("google")}
              disabled={loadingProvider !== null}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5"
              >
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.1 0 5.7 1.1 7.7 3.1l5.7-5.7C33.6 3.5 29.2 1.5 24 1.5 14.8 1.5 7.2 7.9 4.4 16.3l6.7 5.2C12.4 14.1 17.7 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.1 24.5c0-1.5-.1-2.6-.4-3.8H24v7.1h12.4c-.3 2-1.7 5-4.8 7l7.4 5.7c4.3-3.9 6.1-9.6 6.1-16z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.6 28.5c-.6-1.9-1-4-1-6s.4-4.1 1-6L4 11.3C2.1 15 1 19.3 1 24s1.1 9 3 12.7l6.6-5.2z"
                />
                <path
                  fill="#EA4335"
                  d="M24 47c5.8 0 10.7-1.9 14.2-5.2l-7.4-5.7c-2 1.4-4.7 2.3-6.8 2.3-6.2 0-11.5-4.6-13.3-10.8L4 36.7C7.1 43.7 14.9 47 24 47z"
                />
                <path fill="none" d="M1 1h46v46H1z" />
              </svg>
              {loadingProvider === "google" ? "Authenticating..." : "Continue with Google"}
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleLogin("github")}
              disabled={loadingProvider !== null}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                fill="white"
                className="h-5 w-5"
              >
                <title>GitHub</title>
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 
                  9.8 8.205 11.387.6.113.82-.258.82-.577 
                  0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61C4.422 
                  17.07 3.633 16.7 3.633 16.7c-1.087-.744.084-.729.084-.729 
                  1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.807 
                  1.303 3.492.997.108-.776.418-1.303.762-1.603-2.665-.3-5.466-1.334-5.466-5.933 
                  0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.116-3.176 
                  0 0 1.008-.322 3.3 1.23a11.48 11.48 0 013.003-.404c1.018.005 
                  2.042.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.655 
                  1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 
                  3.22 0 4.61-2.807 5.63-5.48 5.922.43.372.823 1.102.823 
                  2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 
                  21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              {loadingProvider === "github" ? "Authenticating..." : "Continue with GitHub"}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-zinc-400 text-center">
              By pre-registering, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
    </div>
  )
}

