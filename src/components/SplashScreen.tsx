"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Splash screen component with excellent animations
export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState(0)
  const [showLogo, setShowLogo] = useState(false)

  // Pre-calculate particle positions and properties to avoid Math.random during render
  const particles = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: (i * 37) % 100, // Distribute evenly
    top: (i * 43) % 100,
    size: 3 + (i % 3), // Vary size between 3-5
    color: ['#ff6b9d', '#4ecdc4', '#a855f7', '#f8b500'][i % 4],
    duration: 3 + (i % 2),
    delay: (i * 0.2) % 2,
    xMovement: (i % 2 === 0 ? 15 : -15)
  })), [])

  const floatingHearts = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: 25 + (i * 12) % 50,
    fontSize: 18 + (i % 3) * 5,
    duration: 4 + (i % 2),
    delay: i * 0.4,
    emoji: ['💖', '💕', '💗', '💓'][i % 4]
  })), [])

  useEffect(() => {
    // Stage 0: Initial delay
    const timer1 = setTimeout(() => setStage(1), 500)

    // Stage 1: Logo reveal
    const timer2 = setTimeout(() => {
      setShowLogo(true)
      setStage(2)
    }, 1000)

    // Stage 2: Logo animations
    const timer3 = setTimeout(() => setStage(3), 3000)

    // Stage 3: Exit animation
    const timer4 = setTimeout(() => {
      setStage(4)
      setTimeout(onComplete, 800)
    }, 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, particle.xMovement, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Floating hearts animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                className="absolute text-pink-300"
                style={{
                  left: `${heart.left}%`,
                  fontSize: `${heart.fontSize}px`,
                }}
                initial={{ y: "100vh", opacity: 0 }}
                animate={{
                  y: "-10vh",
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: heart.duration,
                  repeat: Infinity,
                  delay: heart.delay,
                  ease: "easeOut",
                }}
              >
                {heart.emoji}
              </motion.div>
            ))}
          </div>

          {/* Main logo container */}
          <div className="relative z-10 text-center">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: 0.2
                    }
                  }}
                  exit={{
                    scale: 0.8,
                    opacity: 0,
                    rotate: 180,
                    transition: { duration: 0.5 }
                  }}
                  className="mb-8"
                >
                  {/* Logo with pulsing glow effect */}
                  <motion.div
                    animate={{
                      filter: [
                        "drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))",
                        "drop-shadow(0 0 40px rgba(168, 85, 247, 0.4))",
                        "drop-shadow(0 0 20px rgba(236, 72, 153, 0.3))"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="inline-block"
                  >
                    <Image
                      src="/little-mirai-logo.svg"
                      alt="Little Mirai Logo"
                      width={300}
                      height={150}
                      className="w-auto h-auto max-w-full"
                      priority
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading text with typewriter effect */}
            <AnimatePresence>
              {stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <TypewriterText
                    text="Creating magical moments..."
                    className="text-lg md:text-xl text-gray-600 font-medium"
                    speed={80}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress indicator */}
            <motion.div
              className="mt-8 w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </div>

          {/* Corner decorative elements */}
          <motion.div
            className="absolute top-8 left-8 text-3xl"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>

          <motion.div
            className="absolute top-8 right-8 text-3xl"
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5,
              ease: "easeInOut"
            }}
          >
            🌟
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-8 text-3xl"
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 1,
              ease: "easeInOut"
            }}
          >
            💕
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-8 text-3xl"
            animate={{
              rotate: [0, -15, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 1.5,
              ease: "easeInOut"
            }}
          >
            🦋
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Typewriter text component for splash screen
const TypewriterText = ({ text, className, speed = 100 }: {
  text: string,
  className?: string,
  speed?: number
}) => {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text[i])
        i++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span className={className}>
      {displayText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block ml-1 w-0.5 h-5 bg-current"
        />
      )}
    </span>
  )
}