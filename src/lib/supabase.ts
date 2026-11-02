import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_DB_USER_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.DB_USER_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

export const supabaseUserDB = createClient(
  supabaseUrl,
  supabaseKey,
  { db: { schema: 'schema_batok' } }
)
