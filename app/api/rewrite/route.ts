import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, option, language } = await request.json()

    if (!text || !option) {
      return NextResponse.json({ status: "error", message: "Text and option are required" }, { status: 400 })
    }

    // Default to english if language is not provided
    const validLanguage = language === "bangla" ? "bangla" : "english";

    const baseUrl = process.env.API_BASE_URL
    if (!baseUrl) {
      return NextResponse.json({ status: "error", message: "API base URL not configured" }, { status: 500 })
    }

    // Call external API
    const response = await fetch(`${baseUrl}/webhook/rewrite-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers like API keys if needed
        ...(process.env.API_KEY && { Authorization: `Bearer ${process.env.API_KEY}` }),
      },
      body: JSON.stringify({
        text,
        option,
        language: validLanguage,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    // Check if the response has the expected format
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from external API')
    }

    // Process the response to ensure proper formatting
    let output = ''

    // Extract the generated text from the API response
    // This assumes the external API returns the text in some property
    if (typeof data.text === 'string') {
      output = data.text
    } else if (typeof data.message === 'string') {
      output = data.message
    } else if (typeof data.output === 'string') {
      output = data.output
    } else if (typeof data.result === 'string') {
      output = data.result
    } else if (typeof data === 'string') {
      output = data
    } else {
      throw new Error('Could not find text content in API response')
    }

    // Return formatted response with the proper structure
    return NextResponse.json({
      status: "success",
      output: output
    })
  } catch (error) {
    console.error("Generate API error:", error)
    return NextResponse.json({ status: "error", message: "Failed to generate text" }, { status: 500 })
  }
}
