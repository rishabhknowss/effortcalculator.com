import type { Actor, UseCase, TechnicalFactors, EnvironmentalFactors, UCPResults } from "@/lib/types"

// Technical factor weights
const technicalFactorWeights = {
  T1: 2.0, // Distributed System
  T2: 1.0, // Performance Objectives
  T3: 1.0, // End-user Efficiency
  T4: 1.0, // Complex Internal Processing
  T5: 1.0, // Reusability
  T6: 0.5, // Easy to Install
  T7: 0.5, // Easy to Use
  T8: 2.0, // Portability
  T9: 1.0, // Easy to Change
  T10: 1.0, // Concurrency
  T11: 1.0, // Special Security Features
  T12: 1.0, // Direct Access for Third Parties
  T13: 1.0, // Special User Training Facilities
}

// Environmental factor weights
const environmentalFactorWeights = {
  E1: 1.5, // Familiarity with Project
  E2: 0.5, // Application Experience
  E3: 1.0, // Object-oriented Experience
  E4: 0.5, // Lead Analyst Capability
  E5: 1.0, // Motivation
  E6: 2.0, // Stable Requirements
  E7: -1.0, // Part-time Workers
  E8: -1.0, // Difficult Programming Language
}

// Actor complexity weights
const actorWeights = {
  simple: 1,
  average: 2,
  complex: 3,
}

// Use case complexity weights
const useCaseWeights = {
  simple: 5,
  average: 10,
  complex: 15,
}

export function calculateUCP(
  actors: Actor[],
  useCases: UseCase[],
  technicalFactors: TechnicalFactors,
  environmentalFactors: EnvironmentalFactors,
): UCPResults {
  // Count actors by complexity
  const actorCounts = {
    simple: 0,
    average: 0,
    complex: 0,
  }

  actors.forEach((actor) => {
    actorCounts[actor.complexity]++
  })

  // Calculate Unadjusted Actor Weight (UAW)
  const uaw =
    actorCounts.simple * actorWeights.simple +
    actorCounts.average * actorWeights.average +
    actorCounts.complex * actorWeights.complex

  // Count use cases by complexity
  const useCaseCounts = {
    simple: 0,
    average: 0,
    complex: 0,
  }

  useCases.forEach((useCase) => {
    useCaseCounts[useCase.complexity]++
  })

  // Calculate Unadjusted Use Case Weight (UUCW)
  const uucw =
    useCaseCounts.simple * useCaseWeights.simple +
    useCaseCounts.average * useCaseWeights.average +
    useCaseCounts.complex * useCaseWeights.complex

  // Calculate Unadjusted Use Case Points (UUCP)
  const uucp = uaw + uucw

  // Calculate Technical Complexity Factor (TCF)
  let tfactor = 0
  for (const [factor, value] of Object.entries(technicalFactors)) {
    const weight = technicalFactorWeights[factor as keyof typeof technicalFactorWeights]
    tfactor += value * weight
  }
  const tcf = 0.6 + tfactor / 100

  // Calculate Environmental Complexity Factor (ECF)
  let efactor = 0
  for (const [factor, value] of Object.entries(environmentalFactors)) {
    const weight = environmentalFactorWeights[factor as keyof typeof environmentalFactorWeights]
    efactor += value * weight
  }
  const ecf = 1.4 + -0.03 * efactor

  // Calculate Use Case Points (UCP)
  const ucp = uucp * tcf * ecf

  // Determine project complexity for productivity factor
  // Count how many E1-E6 factors are below 3
  const lowPositiveFactors = [
    environmentalFactors.E1,
    environmentalFactors.E2,
    environmentalFactors.E3,
    environmentalFactors.E4,
    environmentalFactors.E5,
    environmentalFactors.E6,
  ].filter((value) => value < 3).length

  // Count how many E7-E8 factors are above 3
  const highNegativeFactors = [environmentalFactors.E7, environmentalFactors.E8].filter((value) => value > 3).length

  // Calculate total risk factors
  const riskFactors = lowPositiveFactors + highNegativeFactors

  // Determine productivity factor based on risk
  let productivityFactor = 20 // Default for simple projects

  if (riskFactors <= 2) {
    productivityFactor = 20 // Simple project
  } else if (riskFactors <= 4) {
    productivityFactor = 24 // Medium complexity
  } else {
    productivityFactor = 28 // High complexity
  }

  // Calculate effort in person-hours
  const effort = ucp * productivityFactor

  return {
    uaw,
    uucw,
    uucp,
    tcf,
    ecf,
    ucp,
    productivityFactor,
    effort,
    actorCounts,
    useCaseCounts,
  }
}
