"use client"

import { useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mainFeatures } from "@/constants"
import { AnimatePresence, motion } from "framer-motion"

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      {/* Floating Action Button with gradient */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white shadow-lg"
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: isOpen ? 180 : 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.3,
        }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>

      {/* Creative Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-64 overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            {/* Decorative header */}
            <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 p-4">
              <h3 className="text-lg font-bold text-white">Navigare</h3>
              <div className="mt-1 h-1 w-12 rounded-full bg-white/30"></div>
            </div>

            {/* Navigation items with staggered animation */}
            <nav className="relative p-2">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>

              <div className="relative">
                {mainFeatures.map((item, index) => (
                  <motion.div
                    key={item.route}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.route}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "group mb-2 flex items-center justify-between rounded-xl p-3 transition-all",
                        pathname === item.route ? "bg-emerald-100 text-emerald-800" : "hover:bg-emerald-50",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            pathname === item.route
                              ? "bg-emerald-700 text-white"
                              : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200",
                          )}
                        >
                          {/* {featureIcons[item.route as keyof typeof featureIcons]} */}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          pathname === item.route
                            ? "text-emerald-700"
                            : "text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1",
                        )}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Decorative footer */}
            <div className="flex items-center justify-center bg-emerald-50 p-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-300 mx-0.5"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mx-0.5"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mx-0.5"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 mx-0.5"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-700 mx-0.5"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

