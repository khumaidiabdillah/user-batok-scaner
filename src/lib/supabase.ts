import { createClient } from '@supabase/supabase-js'

function sanitizeUrl(raw?: string): string {
  if (!raw) return 'https://placeholder.supabase.co'
  const match = raw.match(/https?:\/\/[a-z0-9\-]+\.supabase\.co/i)
  if (match) return match[0]
  let cleaned = raw.replace(/[\[\]\s]/g, '')
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned
  }
  try {
    new URL(cleaned)
    return cleaned
  } catch {
    return 'https://placeholder.supabase.co'
  }
}

function sanitizeKey(raw?: string): string {
  if (!raw) return 'placeholder-service-role-key'
  const cleaned = raw.replace(/[\[\]\s]/g, '')
  return cleaned || 'placeholder-service-role-key'
}

const userUrl = sanitizeUrl(process.env.NEXT_PUBLIC_DB_USER_URL)
const userKey = sanitizeKey(process.env.DB_USER_SERVICE_ROLE_KEY)

export const supabaseUserDB = createClient(
  userUrl,
  userKey,
  { db: { schema: 'schema_batok' } }
)
