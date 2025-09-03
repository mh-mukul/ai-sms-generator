const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T> {
    status: string;
    message?: string;
    output?: string;
}

export async function publicApiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string> || {}),
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (response.ok) {
            return {
                status: data.status,
                message: data.message,
                output: data.text || data.message || data.output || data.result || (typeof data === 'string' ? data : undefined)
            };
        } else {
            return { status: data.status, message: data.message || 'An error occurred' };
        }
    } catch (error) {
        console.error('Public API client error:', error);
        return { status: 'Failed', message: 'Network error or server is unreachable' };
    }
}

// SMS Generator API client functions
export interface GenerateSMSParams {
    original_sms: string;
    objective: string;
    age_range: string;
    gender: string;
    customer_segment: string;
    personalization: string;
    char_limit: number;
    language: string;
    additional_context?: string;
}

export async function generateSMS(params: GenerateSMSParams): Promise<ApiResponse<string>> {
    return publicApiClient<string>('/webhook/v1/generate-sms', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}

export interface RewriteSMSParams {
    text: string;
    option: string;
    language: string;
}

export async function rewriteSMS(params: RewriteSMSParams): Promise<ApiResponse<string>> {
    return publicApiClient<string>('/webhook/rewrite-sms', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}