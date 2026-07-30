import { useEffect, useRef } from "react";

import { getSocket } from "@/services/ws/ws-client";

type MessageCallback = (message: string) => void;

export function useSocketSubscribe(event: string, onMessage: MessageCallback) {
  const callbackRef = useRef(onMessage);

  useEffect(() => {
    callbackRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const socket = getSocket();
    const handler = (payload: string) => callbackRef.current(payload);

    socket.on(event, handler);

    const requestState = () => socket.emit("request-state");

    requestState();
    socket.on("connect", requestState);

    return () => {
      socket.off(event, handler);
      socket.off("connect", requestState);
    };
  }, [event]);
}
