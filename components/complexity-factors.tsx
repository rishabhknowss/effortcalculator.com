"use client"

import type React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { Settings, Lightbulb } from "lucide-react"
import type { TechnicalFactors, EnvironmentalFactors } from "@/lib/types"

interface ComplexityFactorsProps {
  technicalFactors: TechnicalFactors
  environmentalFactors: EnvironmentalFactors
  setTechnicalFactors: React.Dispatch<React.SetStateAction<TechnicalFactors>>
  setEnvironmentalFactors: React.Dispatch<React.SetStateAction<EnvironmentalFactors>>
}

export function ComplexityFactors({
  technicalFactors,
  environmentalFactors,
  setTechnicalFactors,
  setEnvironmentalFactors,
}: ComplexityFactorsProps) {
  const handleTechnicalFactorChange = (factor: keyof TechnicalFactors, value: number) => {
    setTechnicalFactors({
      ...technicalFactors,
      [factor]: value,
    })
  }

  const handleEnvironmentalFactorChange = (factor: keyof EnvironmentalFactors, value: number) => {
    setEnvironmentalFactors({
      ...environmentalFactors,
      [factor]: value,
    })
  }

  return (
    <motion.div
      className="mt-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div>
        <h2 className="text-xl font-semibold flex items-center">
          <span className="bg-primary/40 w-2 h-6 rounded-sm mr-2"></span>
          Complexity Factors
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust the technical and environmental factors to refine your effort estimation.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="technical-factors" className="border-b-0">
          <AccordionTrigger className="text-lg font-medium py-4 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Technical Complexity Factors
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6 px-1">
            <div className="space-y-6">
              {technicalFactorsList.map((factor, index) => (
                <motion.div
                  key={factor.id}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.03 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs font-medium text-primary">
                        {factor.id.substring(1)}
                      </div>
                      <label className="text-sm font-medium">{factor.name}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Weight: {factor.weight}</span>
                      <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary min-w-[2rem] text-center">
                        {technicalFactors[factor.id as keyof TechnicalFactors]}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[technicalFactors[factor.id as keyof TechnicalFactors]]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={(value) =>
                      handleTechnicalFactorChange(factor.id as keyof TechnicalFactors, value[0])
                    }
                    className="py-1"
                  />
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="environmental-factors" className="border-0 mt-4">
          <AccordionTrigger className="text-lg font-medium py-4 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary/60" />
              Environmental Complexity Factors
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6 px-1">
            <div className="space-y-6">
              {environmentalFactorsList.map((factor, index) => (
                <motion.div
                  key={factor.id}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.03 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs font-medium text-primary/60">
                        {factor.id.substring(1)}
                      </div>
                      <label className="text-sm font-medium">{factor.name}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Weight: {factor.weight}</span>
                      <span
                        className={`text-sm font-medium px-2 py-0.5 rounded-full min-w-[2rem] text-center ${
                          factor.weight < 0 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary/60"
                        }`}
                      >
                        {environmentalFactors[factor.id as keyof EnvironmentalFactors]}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[environmentalFactors[factor.id as keyof EnvironmentalFactors]]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={(value) =>
                      handleEnvironmentalFactorChange(factor.id as keyof EnvironmentalFactors, value[0])
                    }
                    className="py-1"
                  />
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  )
}

const technicalFactorsList = [
  {
    id: "T1",
    name: "Distributed System",
    description: "The application is distributed across multiple locations or organizations",
    weight: 2,
  },
  {
    id: "T2",
    name: "Performance Objectives",
    description: "Response time or throughput performance objectives influence the design",
    weight: 1,
  },
  { id: "T3", name: "End-user Efficiency", description: "The application emphasizes user efficiency", weight: 1 },
  {
    id: "T4",
    name: "Complex Internal Processing",
    description: "The application has complex algorithms or calculations",
    weight: 1,
  },
  { id: "T5", name: "Reusability", description: "Code must be designed for reuse in other applications", weight: 1 },
  { id: "T6", name: "Easy to Install", description: "Installation ease is an objective", weight: 0.5 },
  { id: "T7", name: "Easy to Use", description: "Usability is an important consideration", weight: 0.5 },
  { id: "T8", name: "Portability", description: "The application must run on different platforms", weight: 2 },
  { id: "T9", name: "Easy to Change", description: "The application will undergo frequent changes", weight: 1 },
  {
    id: "T10",
    name: "Concurrency",
    description: "The application must handle concurrent users or processes",
    weight: 1,
  },
  {
    id: "T11",
    name: "Special Security Features",
    description: "The application has special security requirements",
    weight: 1,
  },
  {
    id: "T12",
    name: "Direct Access for Third Parties",
    description: "The application provides direct access to third parties",
    weight: 1,
  },
  {
    id: "T13",
    name: "Special User Training Facilities",
    description: "Special training facilities or procedures are required",
    weight: 1,
  },
]

const environmentalFactorsList = [
  {
    id: "E1",
    name: "Familiarity with Project",
    description: "Team's familiarity with the project or domain",
    weight: 1.5,
  },
  { id: "E2", name: "Application Experience", description: "Team's experience with similar applications", weight: 0.5 },
  {
    id: "E3",
    name: "Object-oriented Experience",
    description: "Team's experience with object-oriented development",
    weight: 1,
  },
  { id: "E4", name: "Lead Analyst Capability", description: "Capability of the lead analyst", weight: 0.5 },
  { id: "E5", name: "Motivation", description: "Team's motivation level", weight: 1 },
  { id: "E6", name: "Stable Requirements", description: "Stability of the requirements", weight: 2 },
  { id: "E7", name: "Part-time Workers", description: "Use of part-time workers (negative factor)", weight: -1 },
  {
    id: "E8",
    name: "Difficult Programming Language",
    description: "Use of difficult programming language (negative factor)",
    weight: -1,
  },
]
