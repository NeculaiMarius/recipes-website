"use client"
import React, { useEffect, useState } from "react"
import { UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const NavBarLogo = () => {
  const pathname = usePathname()
  if (!["/My-fridge", "/Product-scanner", "/"].includes(pathname)) {
    return null
  }

  return (
    <Link
      href="/"
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 shadow-md"
    >
      <motion.div
        className="p-2 bg-emerald-700 rounded-full shadow-md"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 8, 
          ease: "easeInOut",
        }}
      >
        <UtensilsCrossed className="h-5 w-5 text-white" strokeWidth={2} />
      </motion.div>
      <span className="font-semibold text-lg max-sm:text-base text-emerald-700 whitespace-nowrap">
        Recipe Website
      </span>
    </Link>
  )
}

export default NavBarLogo
