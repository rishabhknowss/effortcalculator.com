import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client with better error handling
let genAI: any
let model: any

try {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error("GEMINI_API_KEY environment variable is not set")
  } else {
    // Using GoogleGenerativeAI instead of GoogleGenAI
    genAI = new GoogleGenerativeAI(apiKey)
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    console.log("Gemini API client initialized successfully")
  }
} catch (error) {
  console.error("Error initializing Gemini API client:", error)
}

export async function POST(request: NextRequest) {
  console.log("API route called: /api/analyze")

  try {
    // Check if Gemini API is properly initialized
    if (!genAI || !model) {
      console.error("Gemini API client not initialized. Check your API key.")
      return NextResponse.json(
        { error: "API configuration error. Please check server logs for details." },
        { status: 500 },
      )
    }

    // Parse form data
    let formData
    try {
      formData = await request.formData()
      console.log("Form data received")
    } catch (error) {
      console.error("Error parsing form data:", error)
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }

    const file = formData.get("file") as File | null

    if (!file) {
      console.error("No file provided in form data")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("File received:", file.name, file.type, `${Math.round(file.size / 1024)} KB`)

    // Check file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type. Only PNG, JPG, and PDF are supported." }, { status: 400 })
    }

    // Convert file to ArrayBuffer and then to Base64
    let fileBytes
    try {
      const arrayBuffer = await file.arrayBuffer()
      fileBytes = new Uint8Array(arrayBuffer)
      console.log("File converted to bytes, length:", fileBytes.length)
    } catch (error) {
      console.error("Error processing file:", error)
      return NextResponse.json({ error: "Failed to process the uploaded file" }, { status: 500 })
    }

    // Prepare the prompt for Gemini
    const prompt = `
      Analyze this UML diagram or software architecture diagram and identify all actors and use cases.
      
      For each actor, determine if it's simple, average, or complex based on these criteria:
      - Simple Actors (weight 1): External systems with well-defined API interfaces
      - Average Actors (weight 2): External systems using protocols or humans using text interfaces
      - Complex Actors (weight 3): Humans using graphical user interfaces
      
      For each use case, determine if it's simple, average, or complex based on these criteria:
      - Simple Use Cases (weight 5): 1-3 transactions, simple implementation
      - Average Use Cases (weight 10): 4-7 transactions, moderate complexity
      - Complex Use Cases (weight 15): More than 7 transactions or complex business logic
      
      If the diagram doesn't explicitly show complexity, infer it from the context, relationships, and naming.
      
      Return the results in JSON format with this structure:
      {
        "actors": [
          { "name": "ActorName", "complexity": "simple|average|complex" }
        ],
        "useCases": [
          { "name": "UseCaseName", "complexity": "simple|average|complex" }
        ]
      }
      
      If you can't identify any actors or use cases, return empty arrays.
      Only return valid JSON that matches the structure above.
    `

    console.log("Calling Gemini Vision API...")

    // Call Gemini Vision API with better error handling
    let result
    try {
      // Using the correct format for the Gemini Pro Vision model
      result = await model.generateContent({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: file.type,
                  data: Buffer.from(fileBytes).toString("base64"),
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      })

      console.log("Gemini API response received")
    } catch (error: any) {
      console.error("Error calling Gemini API:", error)
      // Return more specific error information
      return NextResponse.json(
        {
          error: "Failed to analyze the diagram with AI",
          details: error.message || "Unknown error",
        },
        { status: 500 },
      )
    }

    // Handle the response
    try {
      const response = result.response
      const text = response.text()
      console.log("Gemini response text (first 200 chars):", text.substring(0, 200))

      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/)

      if (!jsonMatch) {
        console.error("Could not extract JSON from AI response")
        // Return a fallback response with empty arrays
        return NextResponse.json({
          actors: [],
          useCases: [],
          warning: "AI could not identify elements in the diagram",
        })
      }

      const jsonString = jsonMatch[1] || jsonMatch[0]
      let parsedResult

      try {
        parsedResult = JSON.parse(jsonString)
        console.log("Successfully parsed JSON response")
      } catch (error) {
        console.error("JSON parsing error:", error, "Raw JSON string:", jsonString.substring(0, 200))
        // Return a fallback response with empty arrays
        return NextResponse.json({
          actors: [],
          useCases: [],
          warning: "Failed to parse AI response",
        })
      }

      // Validate the structure with fallbacks
      const actors = Array.isArray(parsedResult.actors) ? parsedResult.actors : []
      const useCases = Array.isArray(parsedResult.useCases) ? parsedResult.useCases : []

      // Ensure all actors and use cases have valid complexity values
      const validComplexities = ["simple", "average", "complex"]

      const validatedActors = actors.map((actor: any) => ({
        name: actor.name || "Unnamed Actor",
        complexity: validComplexities.includes(actor.complexity) ? actor.complexity : "simple",
      }))

      const validatedUseCases = useCases.map((useCase: any) => ({
        name: useCase.name || "Unnamed Use Case",
        complexity: validComplexities.includes(useCase.complexity) ? useCase.complexity : "simple",
      }))

      console.log(`Analysis complete: Found ${validatedActors.length} actors and ${validatedUseCases.length} use cases`)

      return NextResponse.json({
        actors: validatedActors,
        useCases: validatedUseCases,
      })
    } catch (error) {
      console.error("Error processing Gemini response:", error)
      return NextResponse.json({ error: "Failed to process AI response" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unhandled API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
