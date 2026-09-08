import { supabase } from '../lib/supabase'

export { supabase }

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
