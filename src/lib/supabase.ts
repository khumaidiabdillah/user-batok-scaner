import { createClient } from '@supabase/supabase-js'

export const supabaseUserDB = createClient(
  process.env.NEXT_PUBLIC_DB_USER_URL!,
  process.env.DB_USER_SERVICE_ROLE_KEY!,
  { db: { schema: 'schema_batok' } }
)
