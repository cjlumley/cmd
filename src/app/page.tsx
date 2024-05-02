import Image from "next/image";
import { WelcomeBanner } from "./chat/chat";

export default function Home() {
  return (
    <div className="h-[100dvh] w-[100dvw]">
      <WelcomeBanner className="w-full" />
    </div>
  );
}
