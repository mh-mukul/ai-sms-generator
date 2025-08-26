import { type NextRequest, NextResponse } from "next/server"
import https from "node:https"
import nodeFetch from "node-fetch"

// Create a custom fetch that ignores SSL certificate issues
const customFetch = (url: string, options: any) => {
  // Create a custom HTTPS agent that ignores certificate validation
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Ignore SSL certificate validation
    timeout: 30000 // Add a timeout to avoid hanging requests
  });

  // Log that we're using the custom fetch with SSL verification disabled
  console.log("Using custom fetch with disabled SSL verification");

  // Add user-agent and other headers that might help with connection issues
  const headers = {
    ...options.headers,
    'User-Agent': 'text-generator-api/1.0'
  };

  return nodeFetch(url, {
    ...options,
    headers,
    agent: httpsAgent,
    timeout: 30000 // Also set timeout at fetch level
  });
};

export async function POST(request: NextRequest) {
  try {
    const {
      objective,
      age_range,
      gender,
      customer_segment,
      tone,
      personalization,
      char_limit,
      allow_emojis,
      goal,
      language,
      cultural_reference,
      additional_context
    } = await request.json()

    // Check if the API_BASE_URL is configured
    const baseUrl = process.env.API_BASE_URL
    const isProduction = process.env.NODE_ENV === 'production'

    console.log(`Environment: ${process.env.NODE_ENV || 'unknown'}`);

    let output = ""

    if (!baseUrl) {
      console.error("API_BASE_URL is not configured in environment variables");
      return NextResponse.json({
        status: "error",
        message: "API_BASE_URL is not configured"
      }, { status: 500 });
    }

    console.log(`Using API_BASE_URL: ${baseUrl}`);

    try {
      const apiUrl = `${baseUrl}/webhook/generate-sms`;
      console.log(`Calling external API at: ${apiUrl} in ${isProduction ? 'production' : 'development'} mode`);

      const apiRequestBody = {
        objective,
        age_range,
        gender,
        customer_segment,
        tone,
        personalization,
        char_limit,
        allow_emojis,
        goal,
        language,
        cultural_reference,
        additional_context
      };

      console.log("Request body:", JSON.stringify(apiRequestBody));

      // Call external API (wrapped in try-catch for better error handling)
      const response = await customFetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody)
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error(`API request failed with status ${response.status}. Response: ${errorText}`);
        throw new Error(`API request failed: ${response.status}`)
      }

      console.log(`API response status: ${response.status}`);
      const data = await response.json();
      console.log("API response data:", data);

      // Check if the response has the expected format
      if (!data || typeof data !== 'object') {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from external API')
      }

      // Process the response to ensure proper formatting
      // Extract the generated text from the API response
      if (typeof data.text === 'string') {
        output = data.text;
        console.log("Using 'text' field from response");
      } else if (typeof data.message === 'string') {
        output = data.message;
        console.log("Using 'message' field from response");
      } else if (typeof data.output === 'string') {
        output = data.output;
        console.log("Using 'output' field from response");
      } else if (typeof data.result === 'string') {
        output = data.result;
        console.log("Using 'result' field from response");
      } else if (typeof data === 'string') {
        output = data;
        console.log("Using response as string directly");
      } else {
        console.error('Could not find text content in API response:', data);
        throw new Error('Could not find text content in API response')
      }
    } catch (apiError) {
      console.error("External API error:", apiError)

      // Check if the error is due to CORS, network issues, or something else
      if (apiError instanceof Error) {
        console.log(`Error message: ${apiError.message}`);

        // Return detailed error in development for debugging
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json({
            status: "error",
            message: `External API error: ${apiError.message}`,
            hint: "Check your API_BASE_URL in .env"
          }, { status: 500 });
        } else {
          // In production, return a more specific error to help with troubleshooting
          return NextResponse.json({
            status: "error",
            message: "Failed to connect to the backend API. SSL certificate issue or network problem.",
            errorDetails: apiError.message
          }, { status: 500 });
        }
      }
    }

    // Return formatted response with the proper structure
    return NextResponse.json({
      status: "success",
      output: output
    })
  } catch (error) {
    console.error("Generate Content API error:", error)
    return NextResponse.json({
      status: "error",
      message: "Failed to generate content"
    }, { status: 500 })
  }
}
