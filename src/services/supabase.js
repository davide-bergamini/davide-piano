import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function testSupabase() {
  const { data, error } = await supabase
    .from('page_views')
    .select('id')
    .limit(1)

  if (error) {
    console.error('Errore Supabase:', error)
    return false
  }

  console.log('Connessione Supabase OK:', data)
  return true
}
