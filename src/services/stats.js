import { supabase } from './supabase'

export async function registerPageView(page) {
  const { error } = await supabase
    .from('page_views')
    .insert({
      page,
    })

  if (error) {
    console.error('Errore registrazione visualizzazione:', error)
  }
}
