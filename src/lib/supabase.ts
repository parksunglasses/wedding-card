import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

const ROW_ID = 1

export async function loadWeddingDataFromDB(): Promise<Record<string, unknown> | null> {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('wedding_data')
    .select('data')
    .eq('id', ROW_ID)
    .single()
  if (error || !data) return null
  return data.data
}

export async function saveWeddingDataToDB(weddingData: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return
  await supabase
    .from('wedding_data')
    .upsert({ id: ROW_ID, data: weddingData, updated_at: new Date().toISOString() })
}
