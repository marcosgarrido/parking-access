import { useEffect, useRef, useState } from "react";

import { DelayedSpinnerOverlay } from "@/components/delayed-spinner-overlay";

type Props = {
  src: string;
  className?: string;
  muted?: boolean;
};

export default function WebRTCPlayer({
  src,
  className = "",
  muted = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) return;

    let cancelled = false;

    function connect() {
      if (cancelled) return;
      setLoading(true);

      const pc = new RTCPeerConnection();

      pcRef.current = pc;

      function scheduleReconnect() {
        pc.close();
        if (video!.srcObject) {
          (video!.srcObject as MediaStream)
            .getTracks()
            .forEach((t) => t.stop());
          video!.srcObject = null;
        }
        setLoading(true);
        if (!cancelled) setTimeout(connect, 3000);
      }

      pc.ontrack = (event) => {
        if (video!.srcObject !== event.streams[0]) {
          video!.srcObject = event.streams[0];
          video!.play().catch(() => {});
          setLoading(false);
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (
          ["failed", "disconnected", "closed"].includes(pc.iceConnectionState)
        ) {
          scheduleReconnect();
        }
      };

      pc.addTransceiver("video", { direction: "recvonly" });
      pc.addTransceiver("audio", { direction: "recvonly" });

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(async () => {
          const res = await fetch(src, {
            method: "POST",
            headers: { "Content-Type": "application/sdp" },
            body: pc.localDescription!.sdp,
          });

          if (!res.ok) throw new Error(`Error WHEP: ${res.statusText}`);
          const answer = await res.text();

          await pc.setRemoteDescription({
            type: "answer",
            sdp: answer,
          });
        })
        .catch((err) => {
          console.error("WHEP error:", err);
          scheduleReconnect();
        });
    }

    connect();

    return () => {
      cancelled = true;
      pcRef.current?.close();
      pcRef.current = null;
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        video.srcObject = null;
      }
    };
  }, [src]);

  return (
    <div className="relative w-full h-full aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover rounded-2xl shadow-xl ${className}`}
        muted={muted}
      />
      <DelayedSpinnerOverlay fullScreen={false} show={loading} />
    </div>
  );
}
