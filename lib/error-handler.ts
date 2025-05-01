// Error handling utilities for production applications

/**
 * Logs errors to the console in development and to a monitoring service in production
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`Error${context ? ` in ${context}` : ""}:`, error)
  } else {
    // In production, you would send this to a monitoring service like Sentry
    // Example: Sentry.captureException(error, { extra: { context } })

    // For now, just log to console in a sanitized way
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error${context ? ` in ${context}` : ""}: ${errorMessage}`)
  }
}

/**
 * Formats an error message for display to users
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Return a user-friendly message based on the error
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Network error. Please check your connection and try again."
    }

    if (error.message.includes("timeout")) {
      return "The request timed out. Please try again."
    }

    if (error.message.includes("permission") || error.message.includes("access")) {
      return "Permission denied. You may not have access to this resource."
    }

    // For AI-specific errors
    if (error.message.includes("AI") || error.message.includes("model")) {
      return "The AI service encountered an error. Please try again later."
    }

    // Return a sanitized version of the error message
    return error.message.replace(/[^\w\s.,?!]/gi, "")
  }

  return "An unexpected error occurred. Please try again."
}

/**
 * Handles API errors and returns appropriate status codes and messages
 */
export function handleApiError(error: unknown): { statusCode: number; message: string } {
  if (error instanceof Error) {
    // Determine appropriate status code based on error
    if (error.message.includes("not found")) {
      return { statusCode: 404, message: "Resource not found" }
    }

    if (error.message.includes("permission") || error.message.includes("unauthorized")) {
      return { statusCode: 403, message: "Permission denied" }
    }

    if (error.message.includes("invalid") || error.message.includes("validation")) {
      return { statusCode: 400, message: "Invalid request" }
    }

    // For rate limiting or quota errors
    if (error.message.includes("rate") || error.message.includes("quota")) {
      return { statusCode: 429, message: "Rate limit exceeded. Please try again later." }
    }
  }

  // Default server error
  return { statusCode: 500, message: "Internal server error" }
}
