// Actor Types
export type ActorComplexity = "simple" | "average" | "complex"

export interface Actor {
  name: string
  complexity: ActorComplexity
}

// Use Case Types
export type UseCaseComplexity = "simple" | "average" | "complex"

export interface UseCase {
  name: string
  complexity: UseCaseComplexity
}

// Technical Factors
export interface TechnicalFactors {
  T1: number // Distributed System
  T2: number // Performance Objectives
  T3: number // End-user Efficiency
  T4: number // Complex Internal Processing
  T5: number // Reusability
  T6: number // Easy to Install
  T7: number // Easy to Use
  T8: number // Portability
  T9: number // Easy to Change
  T10: number // Concurrency
  T11: number // Special Security Features
  T12: number // Direct Access for Third Parties
  T13: number // Special User Training Facilities
}

// Environmental Factors
export interface EnvironmentalFactors {
  E1: number // Familiarity with Project
  E2: number // Application Experience
  E3: number // Object-oriented Experience
  E4: number // Lead Analyst Capability
  E5: number // Motivation
  E6: number // Stable Requirements
  E7: number // Part-time Workers
  E8: number // Difficult Programming Language
}

// UCP Results
export interface UCPResults {
  uaw: number // Unadjusted Actor Weight
  uucw: number // Unadjusted Use Case Weight
  uucp: number // Unadjusted Use Case Points
  tcf: number // Technical Complexity Factor
  ecf: number // Environmental Complexity Factor
  ucp: number // Use Case Points
  productivityFactor: number // Hours per UCP
  effort: number // Total effort in hours
  actorCounts: {
    simple: number
    average: number
    complex: number
  }
  useCaseCounts: {
    simple: number
    average: number
    complex: number
  }
}

// Gemini API Response
export interface GeminiAnalysisResult {
  actors: Actor[]
  useCases: UseCase[]
}
