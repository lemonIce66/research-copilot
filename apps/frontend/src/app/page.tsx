"use client";
import dynamic from "next/dynamic";

const ChatContainer = dynamic(
  () => import("@/components/chat/ChatContainer").then((m) => m.ChatContainer),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="h-screen">
      <ChatContainer />
    </main>
  );
}
