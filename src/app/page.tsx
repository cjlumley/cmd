"use client"
import Image from "next/image";
import { WelcomeBanner } from "./chat/chat";
import SolanaAuth from "../components/SolanaAuth";

export default function Home() {
  return (
    <div className="h-[100dvh] w-[100dvw]">
      < SolanaAuth />
    </div>
  );
}
