"use client";

import { SessionProvider } from "next-auth/react";

type Props = {
  session: any;
  children: React.ReactNode;
};

export default function SessionProviderWrapper({ session, children }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
