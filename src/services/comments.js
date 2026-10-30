
import { supabase } from './supabase'

// Carica tutti i commenti di un'opera
export async function fetchComments(workId) {
  const { data, error } = await supabase
    .from('work_comments')
    .select('id, work_id, author_name, comment, created_at')
    .eq('work_id', workId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Errore caricamento commenti:', error)
    return []
  }

  return data
}

// Pubblica un nuovo commento
export async function addComment(workId, comment) {
  const text = comment.trim()

  if (!text || text.length < 2 || text.length > 1000) {
    return null
  }

  const { data, error } = await supabase
    .from('work_comments')
    .insert({
      work_id: workId,
      author_name: 'Anonimo',
      comment: text,
    })
    .select()
    .single()

  if (error) {
    console.error('Errore pubblicazione commento:', error)
    return null
  }

  return data
}
