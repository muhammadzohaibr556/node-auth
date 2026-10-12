import { z } from 'zod'

export class ApiError extends Error {
  status: number
  fields: Record<string, string>

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

const errorSchema = z.object({
  message: z.string().optional(),
  errors: z.array(z.object({ field: z.string().optional(), message: z.string() })).optional(),
})

export async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  options: { method?: 'POST' | 'PATCH'; body?: unknown; token?: string; signal?: AbortSignal } = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api/v1${path}`, {
      method: options.method ?? 'GET',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  } catch (error) {
    if (options.signal?.aborted) throw error
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0)
  }

  const json: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const error = errorSchema.safeParse(json)
    const fields = Object.fromEntries(error.success
      ? (error.data.errors ?? []).filter(item => item.field).map(item => [item.field!, item.message])
      : [])
    throw new ApiError(error.success && error.data.message
      ? error.data.message : 'The server could not complete your request. Please try again.', response.status, fields)
  }
  const result = schema.safeParse(json)
  if (!result.success) throw new ApiError('The server returned an unexpected response. Please try again.', response.status)
  return result.data
}
