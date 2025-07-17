"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Music, Plus, ThumbsUp, ThumbsDown, Play, Users, Clock, LinkIcon } from "lucide-react"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { YT_REGEX } from "../lib/reg"
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { ToastContainer, toast } from 'react-toastify';

interface Song {
  id: string
  type: string
  title: string
  url: string
  extractedId: string
  smallImg: string
  bigImg: string
  active: boolean
  userId: string
  upvotes: number
  haveUpvoted: boolean
}

const REFRESH_INTERVAL = 10 * 1000;

export default function StreamView({
  creatorId
}: {
  creatorId: String
}) {
  const [queue, setQueue] = useState<Song[]>([])

  async function refreshstream() {
    try {
      const res = await fetch(`/api/streams?creatorId=${creatorId}`, {
        credentials: "include"
      });

      if (!res.ok) {
        console.error("Failed to fetch streams", res.status);
        return;
      }

      const json = await res.json();
      console.log(json.streams);
      setQueue(json.streams);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  }

  useEffect(() => {
    refreshstream();
    const Interval = setInterval(() => {
      refreshstream();
    }, REFRESH_INTERVAL)
  }, [])

  const [newUrl, setNewUrl] = useState("")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Sort queue by votes (highest first)
  const sortedQueue = [...queue].sort((a, b) => b.upvotes - a.upvotes)

  // Set currently playing to highest voted song
  useEffect(() => {
    if (sortedQueue.length > 0 && !currentlyPlaying) {
      setCurrentlyPlaying(sortedQueue[0])
    }
  }, [sortedQueue, currentlyPlaying])

  // Extracted Id
  const extractVideoId = (url: string) => {
    const match = url.match(YT_REGEX)
    return match ? match[1] : null
  }

  // Add song to queue 
  const addSongToQueue = async () => {
    setIsLoading(true)

    const videoId = extractVideoId(newUrl)

    if (!videoId) {
      alert("Please enter a valid YouTube URL")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/streams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: creatorId,
          url: newUrl
        })
      })
      const data = await res.json()
      const newSong: Song = data.song

      setQueue((prev) => [...prev, newSong])
      setNewUrl("")
    } catch (err) {
      console.error(err)
    }

    setIsLoading(false)
  }
  const vote = (songId: string, isCurrentlyUpvoted: boolean) => {
    const newVoteType = isCurrentlyUpvoted ? "downvote" : "upvote";

    setQueue((prev) =>
      prev.map((song) =>
        song.id === songId
          ? {
            ...song,
            upvotes: isCurrentlyUpvoted ? song.upvotes - 1 : song.upvotes + 1,
            haveUpvoted: !song.haveUpvoted
          }
          : song
      )
    );

    fetch(`/api/streams/${newVoteType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        streamId: songId
      })
    });
  };

  const playNext = () => {
    const nextSong = sortedQueue.find((song) => song.id !== currentlyPlaying?.id)
    if (nextSong) {
      setCurrentlyPlaying(nextSong)
    }
  }

  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast.success('Link copied to clipboard', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        // transition: Bounce,

      })
    },(err)=>{
      console.error('could not copy text',err)
      toast.error('Failed to copy link Please try again.',{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    })
  };


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
                <Button
                  onClick={handleShare}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Share
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {currentlyPlaying ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden ">
                    <LiteYouTubeEmbed id={currentlyPlaying.extractedId} title={currentlyPlaying.title} poster="maxresdefault" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{currentlyPlaying.title}</h3>
                    {/* <p className="text-gray-400 text-sm">Added by {currentlyPlaying.addedBy}</p> */}
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
                        onClick={() => vote(song.id, !!song.haveUpvoted)}
                        className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                      >
                        {song.haveUpvoted === true ? <ThumbsDown className="h-3 w-3" /> : <ThumbsUp className="h-3 w-3" />}
                      </Button>

                      <span className="text-sm font-medium text-white min-w-[2ch] text-center">{song.upvotes}</span>
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
                        <span>by {song.userId}</span>
                        {/* {song.duration && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{song.duration}</span>
                            </div>
                          </>
                        )} */}
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
