import 'server-only'

import { draftMode } from 'next/headers'
import { client } from './client'

const DEFAULT_PARAMS: Record<string, unknown> = {}
const DEFAULT_TAGS: string[] = []

export async function sanityFetch<QueryResponse>(
  query: string,
  params: Record<string, unknown> = DEFAULT_PARAMS,
  tags: string[] = DEFAULT_TAGS
): Promise<QueryResponse> {
  const { isEnabled } = await draftMode()

  if (isEnabled) {
    const token = process.env.SANITY_API_READ_TOKEN
    if (!token) {
      throw new Error('Missing SANITY_API_READ_TOKEN in draft mode')
    }

    return client.fetch<QueryResponse>(query, params, {
      cache: 'no-store',
      // ✅ use tags (array) instead of tag
      next: { tags },
    })
  }

  return client.fetch<QueryResponse>(query, params, {
    next: { revalidate: 60, tags },
  })
}
