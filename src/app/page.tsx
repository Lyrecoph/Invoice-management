'use client';

import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Wrapper from "./components/Wrapper";
export default function Home() {
  const { userId } = useAuth();

  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <Wrapper>
      <button className="btn btn-success">Send</button>
    </Wrapper>
  );
}
