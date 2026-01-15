"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { useInView as useInViewObserver } from "react-intersection-observer"

// Simple particle system for magical effects
export const ParticleSystem = ({ count = 12, colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"] }: { count?: number, colors?: string[] }) => {
  // Use fixed positions and properties to avoid Math.random during render
  const particleConfigs = [
    { x: 10, y: 20, size: 3, color: colors[0], delay: 0 },
    { x: 80, y: 30, size: 4, color: colors[1], delay: 1 },
    { x: 60, y: 70, size: 2, color: colors[2], delay: 2 },
    { x: 20, y: 80, size: 5, color: colors[3], delay: 0.5 },
    { x: 90, y: 50, size: 3, color: colors[0], delay: 1.5 },
    { x: 40, y: 10, size: 2, color: colors[1], delay: 2.5 },
    { x: 70, y: 90, size: 4, color: colors[2], delay: 0.8 },
    { x: 30, y: 60, size: 3, color: colors[3], delay: 1.2 },
    { x: 85, y: 15, size: 2, color: colors[0], delay: 2.8 },
    { x: 15, y: 85, size: 4, color: colors[1], delay: 0.3 },
    { x: 55, y: 40, size: 3, color: colors[2], delay: 1.8 },
    { x: 75, y: 25, size: 2, color: colors[3], delay: 2.2 },
  ].slice(0, count)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleConfigs.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, index % 2 === 0 ? 30 : -30, 0],
            opacity: [0, 0.8, 0],
            scale: [0.3, 1.2, 0.3],
          }}
          transition={{
            duration: 3 + (index * 0.5),
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Simple morphing background shapes
export const MorphingBackground = ({ className }: { className?: string }) => {
  const shapes = [
    "polygon(50% 0%, 0% 100%, 100% 100%)",
    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
  ]

  const backgroundElements = [
    { id: 0, width: 150, height: 150, left: 10, top: 20 },
    { id: 1, width: 200, height: 120, left: 70, top: 60 },
    { id: 2, width: 180, height: 180, left: 40, top: 10 },
    { id: 3, width: 130, height: 160, left: 80, top: 80 },
  ]

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {backgroundElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute opacity-10"
          style={{
            width: `${element.width}px`,
            height: `${element.height}px`,
            left: `${element.left}%`,
            top: `${element.top}%`,
            background: `linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))`,
          }}
          animate={{
            clipPath: shapes,
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + element.id * 2,
            repeat: Infinity,
            ease: "linear",
            delay: element.id * 0.5,
          }}
        />
      ))}
    </div>
  )
}

// Advanced button with ripple effect
export const RippleButton = ({
  children,
  className,
  onClick,
  type = "button",
  disabled = false
}: {
  children: React.ReactNode,
  className?: string,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  type?: "button" | "submit" | "reset",
  disabled?: boolean
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)

    if (onClick) {
      onClick(event)
    }
  }

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={addRipple}
      type={type}
      disabled={disabled}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/40"
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            style={{
              left: ripple.x - 100,
              top: ripple.y - 100,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  )
}

// Progressive loading animation
export const ProgressiveReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [isInView, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      animate={isVisible ? {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)"
      } : {}}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}

// Enhanced floating icon with interactive effects
export const FloatingIcon = ({ icon: Icon, className, delay = 0, interactive = true }: {
  icon: React.ComponentType<{ className?: string }>,
  className?: string,
  delay?: number,
  interactive?: boolean
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [-10, 10, -10],
        rotate: isHovered ? [0, -10, 10, 0] : 0,
      }}
      transition={{
        y: {
          duration: 3 + delay * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        },
        rotate: {
          duration: 0.6,
          ease: "easeInOut",
        }
      }}
      whileHover={interactive ? {
        scale: 1.2,
        rotate: [0, -15, 15, 0],
        transition: { duration: 0.5 }
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Icon className="w-full h-full" />
    </motion.div>
  )
}

// Text typewriter effect
export const TypewriterText = ({ text, className, speed = 80 }: { text: string, className?: string, speed?: number }) => {
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
      {!isComplete && <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="ml-1 inline-block w-0.5 h-6 bg-current"
      />}
    </span>
  )
}

// Parallax background component
export const ParallaxBackground = ({ children, speed = 0.5 }: { children: React.ReactNode, speed?: number }) => {
  const y = useMotionValue(0)
  const ySpring = useSpring(y, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const updateY = () => {
      y.set(window.scrollY * speed)
    }

    const handleScroll = () => updateY()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [y, speed])

  return (
    <motion.div style={{ y: ySpring }}>
      {children}
    </motion.div>
  )
}

// Enhanced card with 3D tilt effect
export const TiltCard = ({ children, className, tiltIntensity = 10 }: {
  children: React.ReactNode,
  className?: string,
  tiltIntensity?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltIntensity, -tiltIntensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltIntensity, tiltIntensity])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = (e.clientX - centerX) / rect.width
    const mouseY = (e.clientY - centerY) / rect.height

    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d" as const,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        z: 30,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
    >
      {children}
    </motion.div>
  )
}
// Advanced Text Animation Components

// Sequential word reveal animation
export const SequentialTextReveal = ({
  text,
  className,
  delay = 0,
  wordDelay = 0.1
}: {
  text: string,
  className?: string,
  delay?: number,
  wordDelay?: number
}) => {
  const words = text.split(" ")

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: wordDelay,
            delayChildren: delay
          }
        }
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
              filter: "blur(10px)"
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Advanced typewriter with cursor and sound-like effect
export const AdvancedTypewriter = ({
  text,
  className,
  speed = 50,
  delay = 0,
  cursorColor = "#6366f1",
  onComplete
}: {
  text: string,
  className?: string,
  speed?: number,
  delay?: number,
  cursorColor?: string,
  onComplete?: () => void
}) => {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const startTyping = () => {
      let i = 0
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prev => prev + text[i])
          i++
        } else {
          setIsComplete(true)
          setShowCursor(false)
          clearInterval(timer)
          if (onComplete) onComplete()
        }
      }, speed)

      return () => clearInterval(timer)
    }

    const delayTimer = setTimeout(startTyping, delay * 1000)
    return () => clearTimeout(delayTimer)
  }, [text, speed, delay, onComplete])

  return (
    <span className={`${className} relative`}>
      {displayText}
      {showCursor && (
        <motion.span
          className="inline-block ml-1 w-0.5 bg-current"
          style={{ backgroundColor: cursorColor }}
          animate={{
            opacity: [1, 0],
            height: ["1em", "1.2em", "1em"]
          }}
          transition={{
            opacity: { duration: 0.8, repeat: Infinity, repeatType: "reverse" },
            height: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
          }}
        />
      )}
    </span>
  )
}

// Morphing text effect
export const MorphingText = ({
  texts,
  className,
  duration = 2000
}: {
  texts: string[],
  className?: string,
  duration?: number
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length)
    }, duration)

    return () => clearInterval(interval)
  }, [texts.length, duration])

  return (
    <motion.span
      className={className}
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {texts[currentIndex]}
    </motion.span>
  )
}

// Interactive text with hover effects
export const InteractiveText = ({
  text,
  className,
  hoverEffect = "glow"
}: {
  text: string,
  className?: string,
  hoverEffect?: "glow" | "bounce" | "scale" | "color"
}) => {
  return (
    <motion.span
      className={`${className} cursor-pointer select-none`}
      whileHover={
        hoverEffect === "glow" ? {
          textShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
          scale: 1.05
        } : hoverEffect === "scale" ? { scale: 1.1 } : undefined
      }
      whileTap={{ scale: 0.95 }}
      animate={hoverEffect === "bounce" ? {
        y: [0, -2, 0],
      } : undefined}
      transition={hoverEffect === "bounce" ? {
        duration: 2,
        repeat: Infinity,
        ease: [0.4, 0.0, 0.6, 1]
      } : undefined}
    >
      {text}
    </motion.span>
  )
}

// Gradient text animation
export const GradientText = ({
  text,
  className,
  colors = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4"],
  animate = true
}: {
  text: string,
  className?: string,
  colors?: string[],
  animate?: boolean
}) => {
  return (
    <motion.span
      className={`${className} bg-gradient-to-r bg-clip-text text-transparent`}
      style={{
        backgroundImage: `linear-gradient(45deg, ${colors.join(", ")})`,
        backgroundSize: "200% 200%"
      }}
      animate={animate ? {
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      } : undefined}
      transition={animate ? {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      } : undefined}
    >
      {text}
    </motion.span>
  )
}

// Character-by-character reveal
export const CharByCharReveal = ({
  text,
  className,
  delay = 0,
  charDelay = 0.05
}: {
  text: string,
  className?: string,
  delay?: number,
  charDelay?: number
}) => {
  const chars = text.split("")

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: charDelay,
            delayChildren: delay
          }
        }
      }}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
              rotateX: -90,
              transformOrigin: "bottom"
            },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Dynamic text introduction sequence
export const DynamicIntroduction = ({
  className
}: {
  className?: string
}) => {
  const [phase, setPhase] = useState(0)

  const phases = [
    {
      title: "Welcome to",
      subtitle: "Little Mirai",
      description: "Where precious moments become treasured memories...",
      delay: 2500
    },
    {
      title: "Discover",
      subtitle: "Tiny Treasures",
      description: "Handcrafted clothing that celebrates every milestone...",
      delay: 3000
    },
    {
      title: "Made with",
      subtitle: "Pure Love",
      description: "Natural materials, gentle care, endless smiles...",
      delay: 3000
    },
    {
      title: "Join Our",
      subtitle: "Family Journey",
      description: "Creating beautiful memories, one outfit at a time...",
      delay: 3500
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(prev => (prev + 1) % phases.length)
    }, phases[phase].delay)

    return () => clearTimeout(timer)
  }, [phase])

  const currentPhase = phases[phase]

  return (
    <motion.div
      className={`${className} text-center`}
      key={phase}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="text-lg md:text-xl text-muted-foreground mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {currentPhase.title}
      </motion.div>

      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <GradientText
          text={currentPhase.subtitle}
          colors={["#6366f1", "#a855f7", "#ec4899", "#06b6d4"]}
          animate={true}
        />
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {currentPhase.description}
      </motion.p>
    </motion.div>
  )
}
