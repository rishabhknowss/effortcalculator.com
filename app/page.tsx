import type { Metadata } from "next"
import { Calculator } from "@/components/calculator"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "UML Effort Calculator",
  description: "Calculate software development effort from UML diagrams using AI",
}

export default function Home() {
  const phrases = ["Effort Calculator", "Software Architecture Analysis", "UML Diagram Analysis"]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto py-12 px-4">
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        <div className="text-center mb-12">
          <div className="mb-6">
            <TypewriterEffect phrases={phrases} className="text-5xl font-bold" />
          </div>
          <p className="text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
            Upload UML diagrams and automatically calculate development effort using Use Case Points
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            <span className="mr-2 bg-primary h-2 w-2 rounded-full animate-pulse"></span>
            Powered by Gemini Vision AI
          </div>
        </div>
        <Calculator />
        <Footer />
      </div>
    </main>
  )
}
