"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TypewriterEffectProps {
  phrases: string[]
  className?: string
  delay?: number
}

export const TypewriterEffect = ({ phrases, className = "", delay = 0 }: TypewriterEffectProps) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay the start of the animation
    const startTimeout = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
    }, 3000) // Change phrase every 3 seconds

    return () => clearInterval(intervalId)
  }, [phrases.length, isVisible])

  return (
    <div className={`inline-block ${className}`}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentPhraseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="gradient-text"
          >
            {phrases[currentPhraseIndex]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
