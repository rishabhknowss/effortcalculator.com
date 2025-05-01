"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { ActorTable } from "@/components/actor-table"
import { UseCaseTable } from "@/components/use-case-table"
import { ComplexityFactors } from "@/components/complexity-factors"
import { ResultsDisplay } from "@/components/results-display"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, Sliders, BarChart } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Actor, UseCase, TechnicalFactors, EnvironmentalFactors, UCPResults } from "@/lib/types"

export function Calculator() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [actors, setActors] = useState<Actor[]>([])
  const [useCases, setUseCases] = useState<UseCase[]>([])
  const [technicalFactors, setTechnicalFactors] = useState<TechnicalFactors>(defaultTechnicalFactors)
  const [environmentalFactors, setEnvironmentalFactors] = useState<EnvironmentalFactors>(defaultEnvironmentalFactors)
  const [results, setResults] = useState<UCPResults | null>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (file: File) => {
    setFile(file)
    setImageUrl(URL.createObjectURL(file))
    setActors([])
    setUseCases([])
    setResults(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      console.log("Analyzing file:", file.name, file.type, `${Math.round(file.size / 1024)} KB`)

      // Create form data to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Call the API route
      console.log("Sending request to /api/analyze")
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        console.error("API error response:", response.status, response.statusText)

        // Try to parse error details if available
        let errorMessage = `Server error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = errorData.error
            if (errorData.details) {
              errorMessage += ` - ${errorData.details}`
            }
          }
        } catch (parseError) {
          // If we can't parse as JSON, use the text response
          try {
            const errorText = await response.text()
            if (errorText) {
              errorMessage = `Server error: ${errorText.substring(0, 100)}`
            }
          } catch (textError) {
            // Fallback to status text if we can't get the response text
            console.error("Failed to get error text:", textError)
          }
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("API response received:", result)

      // Check for warning in the response
      if (result.warning) {
        setError(result.warning)
      }

      if (result.actors.length === 0 && result.useCases.length === 0) {
        setError(
          "No actors or use cases were detected in the diagram. Please try a different diagram or ensure it clearly shows UML elements.",
        )
      } else {
        setActors(result.actors)
        setUseCases(result.useCases)
        setActiveTab("review")
      }
    } catch (error) {
      console.error("Error analyzing diagram:", error)
      setError(error instanceof Error ? error.message : "Failed to analyze diagram. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCalculate = () => {
    const results = calculateUCP(actors, useCases, technicalFactors, environmentalFactors)
    setResults(results)
    setActiveTab("results")
  }

  const canCalculate = actors.length > 0 && useCases.length > 0

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-card shadow-xl border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full rounded-none grid grid-cols-3 h-16">
              <TabsTrigger value="upload" className="data-[state=active]:bg-primary/10 h-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Diagram
              </TabsTrigger>
              <TabsTrigger
                value="review"
                disabled={actors.length === 0 && useCases.length === 0}
                className="data-[state=active]:bg-primary/10 h-full"
              >
                <Sliders className="h-4 w-4 mr-2" />
                Review & Adjust
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!results} className="data-[state=active]:bg-primary/10 h-full">
                <BarChart className="h-4 w-4 mr-2" />
                Results
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <TabsContent value="upload" className="space-y-6 mt-0">
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FileUploader onFileUpload={handleFileUpload} />

                    {error && (
                      <Alert variant="destructive" className="mt-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {imageUrl && (
                      <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative rounded-lg overflow-hidden border border-border/50 shadow-md">
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt="UML Diagram"
                            className="w-full object-contain max-h-[400px]"
                          />
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !file}
                            className="bg-primary hover:bg-primary/90 text-white px-6"
                            size="lg"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing with Gemini AI...
                              </>
                            ) : (
                              "Analyze Diagram with Gemini AI"
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="review" className="mt-0">
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2 gradient-text">AI-Detected Elements</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Gemini AI has analyzed your diagram and identified the following elements. You can review and
                        adjust if needed.
                      </p>
                    </div>

                    <ActorTable actors={actors} setActors={setActors} readOnly={false} />
                    <UseCaseTable useCases={useCases} setUseCases={setUseCases} readOnly={false} />
                    <ComplexityFactors
                      technicalFactors={technicalFactors}
                      environmentalFactors={environmentalFactors}
                      setTechnicalFactors={setTechnicalFactors}
                      setEnvironmentalFactors={setEnvironmentalFactors}
                    />

                    <div className="flex justify-end">
                      <Button
                        onClick={handleCalculate}
                        disabled={!canCalculate}
                        className="bg-primary hover:bg-primary/90 text-white px-6"
                        size="lg"
                      >
                        Calculate Effort
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="results" className="mt-0">
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {results && <ResultsDisplay results={results} />}
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Import the calculateUCP function
import { calculateUCP } from "@/lib/ucp-calculator"

const defaultTechnicalFactors: TechnicalFactors = {
  T1: 2, // Distributed System
  T2: 1, // Performance Objectives
  T3: 1, // End-user Efficiency
  T4: 1, // Complex Internal Processing
  T5: 1, // Reusability
  T6: 0.5, // Easy to Install
  T7: 1, // Easy to Use
  T8: 1, // Portability
  T9: 1, // Easy to Change
  T10: 1, // Concurrency
  T11: 1, // Special Security Features
  T12: 1, // Direct Access for Third Parties
  T13: 1, // Special User Training Facilities
}

const defaultEnvironmentalFactors: EnvironmentalFactors = {
  E1: 1.5, // Familiarity with Project
  E2: 0.5, // Application Experience
  E3: 1, // Object-oriented Experience
  E4: 0.5, // Lead Analyst Capability
  E5: 1, // Motivation
  E6: 2, // Stable Requirements
  E7: 0, // Part-time Workers
  E8: 0, // Difficult Programming Language
}
