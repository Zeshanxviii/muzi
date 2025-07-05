import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Users, Vote, Zap } from "lucide-react"
import Link from "next/link"
import Login from "./components/login"
import { Redirect } from "./components/redirect"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="px-6 h-16 flex items-center border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <Music className="h-6 w-6 text-purple-400" />
          <span className="font-bold text-xl">Muzi</span>
        </Link>
        <nav className="ml-auto">
          <Link href={"/login"}>
           <Login />
          </Link>
          <Redirect />
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Let Your Fans Choose the <span className="text-purple-400">Music</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              The streaming platform where your audience votes on what plays next. Build deeper connections through
              collaborative music experiences.
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Start Streaming Free
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Creators Choose StreamTune</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Vote className="h-8 w-8 text-purple-400 mb-4" />
                  <CardTitle className="text-white">Fan Voting</CardTitle>
                  <CardDescription className="text-gray-400">
                    Let your audience vote on songs in real-time
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Zap className="h-8 w-8 text-purple-400 mb-4" />
                  <CardTitle className="text-white">Live Integration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Seamlessly works with your existing streaming setup
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Users className="h-8 w-8 text-purple-400 mb-4" />
                  <CardTitle className="text-white">Community Building</CardTitle>
                  <CardDescription className="text-gray-400">
                    Turn passive listeners into active participants
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-purple-900/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8">Join thousands of creators building stronger communities</p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-gray-800 border-gray-700 text-white" />
              <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">Free to start • No credit card required</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-400">© 2024 StreamTune</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms
            </Link>
            <Link href="#" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
