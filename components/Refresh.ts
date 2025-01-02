"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Refresh = () => {
  const router = useRouter();
  const pathname = usePathname();
  const InitialPathname = useRef(pathname);

  useEffect(() => {
    if (InitialPathname.current === pathname) return;
    router.refresh();
  }, [router, pathname]);
  return null;
};

export default Refresh;