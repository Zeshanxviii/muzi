"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Music, Plus, ThumbsUp, ThumbsDown, Play, Users, Clock, LinkIcon } from "lucide-react"
import axios from "axios"

interface Song {
  id: string
  title: string
  url: string
  videoId: string
  votes: number
  addedBy: string
  duration?: string
}

const REFRESH_INTERVAL = 10* 1000;

export default function Dashboard() {
  const [queue, setQueue] = useState<Song[]>([
    {
      id: "1",
      title: "Lofi Hip Hop Mix",
      url: "https://youtube.com/watch?v=jfKfPfyJRdk",
      videoId: "jfKfPfyJRdk",
      votes: 12,
      addedBy: "StreamerBot",
      duration: "3:45",
    },
    {
      id: "2",
      title: "Chill Beats to Study",
      url: "https://youtube.com/watch?v=5qap5aO4i9A",
      videoId: "5qap5aO4i9A",
      votes: 8,
      addedBy: "MusicFan123",
      duration: "4:12",
    },
    {
      id: "3",
      title: "Electronic Vibes",
      url: "https://youtube.com/watch?v=example3",
      videoId: "example3",
      votes: 5,
      addedBy: "BeatLover",
      duration: "2:58",
    },
  ])

  async function refreshstream() {
    const res = await axios.get(`/api/streams/my`)
    console.log(res);
  }

  useEffect(()=>{
    refreshstream();
    const Interval = setInterval(()=>{

    },REFRESH_INTERVAL)
  },[])

  const [newUrl, setNewUrl] = useState("")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Sort queue by votes (highest first)
  const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes)

  // Set currently playing to highest voted song
  useEffect(() => {
    if (sortedQueue.length > 0 && !currentlyPlaying) {
      setCurrentlyPlaying(sortedQueue[0])
    }
  }, [sortedQueue, currentlyPlaying])

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const addSongToQueue = async () => {
    if (!newUrl.trim()) return

    setIsLoading(true)
    const videoId = extractVideoId(newUrl)

    if (!videoId) {
      alert("Please enter a valid YouTube URL")
      setIsLoading(false)
      return
    }

    // Simulate API call to get video title
    setTimeout(() => {
      const newSong: Song = {
        id: Date.now().toString(),
        title: "New Song Title", // In real app, fetch from YouTube API
        url: newUrl,
        videoId,
        votes: 0,
        addedBy: "You",
        duration: "3:30",
      }

      setQueue((prev) => [...prev, newSong])
      setNewUrl("")
      setIsLoading(false)
    }, 1000)
  }

  const vote = (songId: string, type: "up" | "down") => {
    setQueue((prev) =>
      prev.map((song) => (song.id === songId ? { ...song, votes: song.votes + (type === "up" ? 1 : -1) } : song)),
    )
    fetch("/api/streams/upvote",{
      method:"POST",
      body: JSON.stringify({
        streamId: songId
      })
    })
  }

  const playNext = () => {
    const nextSong = sortedQueue.find((song) => song.id !== currentlyPlaying?.id)
    if (nextSong) {
      setCurrentlyPlaying(nextSong)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}

      <div className="flex-1 grid lg:grid-cols-3 gap-6 p-6">
        {/* Main Content - Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currently Playing */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Play className="h-5 w-5 text-purple-400" />
                  Now Playing
                </CardTitle>
                <Button
                  onClick={playNext}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Skip
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {currentlyPlaying ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentlyPlaying.videoId}?autoplay=1`}
                      title={currentlyPlaying.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{currentlyPlaying.title}</h3>
                    <p className="text-gray-400 text-sm">Added by {currentlyPlaying.addedBy}</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No song playing</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Song Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-400" />
                Add Song to Queue
              </CardTitle>
              <CardDescription className="text-gray-400">
                Paste a YouTube URL to add a song to the voting queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white pl-10"
                    onKeyPress={(e) => e.key === "Enter" && addSongToQueue()}
                  />
                </div>
                <Button
                  onClick={addSongToQueue}
                  disabled={isLoading || !newUrl.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? "Adding..." : "Add Song"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Queue */}
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5 text-purple-400" />
                Song Queue
                <Badge variant="secondary" className="ml-auto bg-gray-700 text-gray-300">
                  {queue.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400">Songs are played based on votes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedQueue.map((song, index) => (
                <div key={song.id} className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900/80 transition-colors">
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => vote(song.id, "up")}
                        className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium text-white min-w-[2ch] text-center">{song.votes}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => vote(song.id, "down")}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">#{index + 1}</span>
                        {song.id === currentlyPlaying?.id && (
                          <Badge className="bg-green-900/50 text-green-400 border-green-800 text-xs">Playing</Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-white text-sm truncate">{song.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>by {song.addedBy}</span>
                        {song.duration && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{song.duration}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < sortedQueue.length - 1 && <Separator className="bg-gray-700" />}
                </div>
              ))}

              {queue.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No songs in queue</p>
                  <p className="text-sm">Add a YouTube URL to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
