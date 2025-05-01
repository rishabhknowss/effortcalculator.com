# UML Diagram Analyzer and Effort Estimator

A modern web application that uses Google's Gemini Vision AI to analyze UML diagrams and automatically calculate software development effort using the Use Case Points (UCP) methodology.

![Screenshot from 2025-05-01 13-46-54](https://github.com/user-attachments/assets/8e2a24cd-8466-4a39-af40-5913d5b7e53a)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [UCP Methodology](#ucp-methodology)
  - [Actor Classification](#actor-classification)
  - [Use Case Classification](#use-case-classification)
  - [Technical Complexity Factors](#technical-complexity-factors)
  - [Environmental Complexity Factors](#environmental-complexity-factors)
  - [Calculation Formulas](#calculation-formulas)
  - [Productivity Factor](#productivity-factor)
- [Implementation Details](#implementation-details)
  - [AI Integration](#ai-integration)
  - [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [Contributing](#contributing)
- [License](#license)

## Overview

The UML Diagram Analyzer and Effort Estimator is a tool designed for software engineers, project managers, and system architects to estimate development effort based on UML diagrams. By leveraging Google's Gemini Vision AI, the application automatically identifies actors and use cases from uploaded diagrams and calculates effort estimates using the industry-standard Use Case Points methodology.

## Features

- **AI-Powered Diagram Analysis**: Upload UML diagrams (PNG, JPG, PDF) and automatically extract actors and use cases
- **Complexity Classification**: AI classifies actors and use cases by complexity level
- **Manual Adjustment**: Review and adjust AI-detected elements if needed
- **Detailed Calculations**: Transparent breakdown of all calculation steps
- **Visual Results**: Charts showing weight distribution and complexity breakdown
- **Modern UI**: Dark-themed, responsive interface for a professional experience

## UCP Methodology

The Use Case Points (UCP) method is a software estimation technique developed by Gustav Karner in 1993. It extends Function Point Analysis to object-oriented systems and is particularly well-suited for estimating projects modeled with UML.

### Actor Classification

Actors are classified into three categories based on their complexity:

| Actor Type | Weight | Description |
|------------|--------|-------------|
| Simple | 1 | External systems with well-defined API interfaces |
| Average | 2 | External systems using protocols or humans using text interfaces |
| Complex | 3 | Humans using graphical user interfaces |

### Use Case Classification

Use cases are classified into three categories based on their complexity:

| Use Case Type | Weight | Description |
|---------------|--------|-------------|
| Simple | 5 | 1-3 transactions, simple implementation |
| Average | 10 | 4-7 transactions, moderate complexity |
| Complex | 15 | More than 7 transactions or complex business logic |

### Technical Complexity Factors

Technical factors adjust the estimate based on non-functional requirements and technical constraints:

| Factor | Description | Weight |
|--------|-------------|--------|
| T1 | Distributed System | 2.0 |
| T2 | Performance Objectives | 1.0 |
| T3 | End-user Efficiency | 1.0 |
| T4 | Complex Internal Processing | 1.0 |
| T5 | Reusability | 1.0 |
| T6 | Easy to Install | 0.5 |
| T7 | Easy to Use | 0.5 |
| T8 | Portability | 2.0 |
| T9 | Easy to Change | 1.0 |
| T10 | Concurrency | 1.0 |
| T11 | Special Security Features | 1.0 |
| T12 | Direct Access for Third Parties | 1.0 |
| T13 | Special User Training Facilities | 1.0 |

Each factor is rated from 0 (no influence) to 5 (essential).

### Environmental Complexity Factors

Environmental factors adjust the estimate based on team and project characteristics:

| Factor | Description | Weight |
|--------|-------------|--------|
| E1 | Familiarity with Project | 1.5 |
| E2 | Application Experience | 0.5 |
| E3 | Object-oriented Experience | 1.0 |
| E4 | Lead Analyst Capability | 0.5 |
| E5 | Motivation | 1.0 |
| E6 | Stable Requirements | 2.0 |
| E7 | Part-time Workers | -1.0 |
| E8 | Difficult Programming Language | -1.0 |

Each factor is rated from 0 (no influence) to 5 (essential). Note that E7 and E8 have negative weights, meaning higher ratings for these factors reduce productivity.

### Calculation Formulas

The UCP calculation follows these steps:

1. **Unadjusted Actor Weight (UAW)**:
   \`\`\`
   UAW = (Simple Actors × 1) + (Average Actors × 2) + (Complex Actors × 3)
   \`\`\`

2. **Unadjusted Use Case Weight (UUCW)**:
   \`\`\`
   UUCW = (Simple Use Cases × 5) + (Average Use Cases × 10) + (Complex Use Cases × 15)
   \`\`\`

3. **Unadjusted Use Case Points (UUCP)**:
   \`\`\`
   UUCP = UAW + UUCW
   \`\`\`

4. **Technical Complexity Factor (TCF)**:
   \`\`\`
   TFactor = Σ(Ti × Wi) where i = 1 to 13 and Wi is the weight of factor Ti
   TCF = 0.6 + (TFactor / 100)
   \`\`\`

5. **Environmental Complexity Factor (ECF)**:
   \`\`\`
   EFactor = Σ(Ei × Wi) where i = 1 to 8 and Wi is the weight of factor Ei
   ECF = 1.4 + (-0.03 × EFactor)
   \`\`\`

6. **Final Use Case Points (UCP)**:
   \`\`\`
   UCP = UUCP × TCF × ECF
   \`\`\`

### Productivity Factor

The productivity factor determines how many hours of effort are required per UCP. It varies based on project complexity:

- **Simple Projects**: 20 hours per UCP
- **Medium Complexity**: 24 hours per UCP
- **High Complexity**: 28 hours per UCP

The complexity level is determined by analyzing environmental factors:
- Count how many E1-E6 factors are rated below 3 (low positive factors)
- Count how many E7-E8 factors are rated above 3 (high negative factors)
- Sum these counts to get the total risk factors

Risk factor thresholds:
- 0-2 risk factors: Simple project (20 hours/UCP)
- 3-4 risk factors: Medium complexity (24 hours/UCP)
- 5+ risk factors: High complexity (28 hours/UCP)

## Implementation Details

### AI Integration

The application uses Google's Gemini Vision AI to analyze UML diagrams. The integration:

1. Converts uploaded diagrams to base64 format
2. Sends the image to Gemini with a detailed prompt via secure server-side API calls
3. Processes the AI response to extract actors and use cases
4. Classifies each element by complexity

The AI is prompted to identify:
- Actor symbols (stick figures, external systems)
- Use case symbols (ovals, rounded rectangles)
- Relationships between actors and use cases
- Notes or annotations describing complexity

### Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **AI Integration**: Google Gemini API (server-side only)
- **Visualization**: Custom SVG charts with animations
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Google Gemini API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/uml-effort-calculator.git
   cd uml-effort-calculator
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables (see next section)

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

Note: The API key is only used server-side for secure API calls to the Gemini service.

## Usage

1. **Upload a UML Diagram**: Click "Select Diagram" or drag and drop a UML diagram file (PNG, JPG, PDF)
2. **Analyze the Diagram**: Click "Analyze Diagram with Gemini AI" to process the diagram
3. **Review AI Results**: Check the detected actors and use cases, adjust if needed
4. **Configure Complexity Factors**: Adjust technical and environmental factors as appropriate
5. **Calculate Effort**: Click "Calculate Effort" to generate the estimate
6. **View Results**: See the detailed breakdown of the UCP calculation and effort estimate

## Assumptions and Limitations

- **Diagram Quality**: The AI analysis works best with clear, well-structured UML diagrams
- **Complexity Classification**: When complexity isn't explicitly shown, the AI makes educated guesses
- **Productivity Factor**: The default productivity factors (20/24/28 hours per UCP) are industry averages and may need adjustment for specific organizations
- **Estimation Accuracy**: Like all estimation methods, UCP provides an approximation, not an exact prediction
- **Learning Curve**: The UCP method assumes a learning curve is factored into the productivity rates


## License

This project is licensed under the MIT License - see the LICENSE file for details.
