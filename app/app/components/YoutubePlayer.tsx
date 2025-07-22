// "use client";

// import { useEffect, useRef } from "react";

// interface YouTubePlayerProps {
//   videoId: string;
//   onEnd: () => void;
// }

// export default function YouTubePlayer({ videoId, onEnd }: YouTubePlayerProps) {
//   const playerRef = useRef<HTMLDivElement>(null);
//   const ytPlayer = useRef<any>(null);

//   useEffect(() => {
//     const tag = document.createElement("script");
//     tag.src = "https://www.youtube.com/iframe_api";
//     document.body.appendChild(tag);

//     window.onYouTubeIframeAPIReady = () => {
//       ytPlayer.current = new window.YT.Player(playerRef.current, {
//         videoId,
//         events: {
//           onReady: (event: any) => event.target.playVideo(),
//           onStateChange: (event: any) => {
//             if (event.data === window.YT.PlayerState.ENDED) {
//               onEnd();
//             }
//           },
//         },
//         playerVars: {
//           autoplay: 1,
//           mute: 0,
//         },
//       });
//     };

//     return () => {
//       if (ytPlayer.current) {
//         ytPlayer.current.destroy();
//       }
//     };
//   }, [videoId]);

//   useEffect(() => {
//     if (ytPlayer.current && ytPlayer.current.loadVideoById) {
//       ytPlayer.current.loadVideoById(videoId);
//     }
//   }, [videoId]);

//   return <div ref={playerRef}></div>;
// }

// # will figurout later
