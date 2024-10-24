"use client"
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import CursorBlinker from "./CursorBlinker";
import { useEffect, useState } from "react";

export default function WelcomeText({username}:{username:string|undefined}) {
  const [showCursor,setShowCursor]=useState(true);

  const baseText = `Bine ai venit, ${username}!`;
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    baseText.slice(0, latest)
  );


  useEffect(() => {
    const controls = animate(count, baseText.length, {
      type: "tween",
      duration: 1.5,
      ease: "easeInOut",
      onComplete:()=>{setShowCursor(false)}
    });

    return controls.stop;
  }, []);

  return (
    <span className="text-center">
      <motion.span className="text-white text-6xl font-bold bold-symbol">
          {displayText}
      </motion.span>
      {showCursor && <CursorBlinker /> }
    </span>
  );
}
