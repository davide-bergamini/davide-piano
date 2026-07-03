import { supabase } from '../lib/supabase'

export async function fetchLikes(pieceIds) {
  const { data, error } = await supabase
    .from('piece_likes')
    .select('piece_id, likes')
    .in('piece_id', pieceIds)

  if (error) {
    console.error('Errore caricamento like:', error)
    return {}
  }

  const result = {}

  pieceIds.forEach((id) => {
    result[id] = 0
  })

  data.forEach((row) => {
    result[row.piece_id] = row.likes
  })

  return result
}

export async function incrementLike(pieceId) {
  const { data: existingRow, error: selectError } = await supabase
    .from('piece_likes')
    .select('piece_id, likes')
    .eq('piece_id', pieceId)
    .maybeSingle()

  if (selectError) {
    console.error('Errore lettura like:', selectError)
    return null
  }

  if (!existingRow) {
    const { data, error } = await supabase
      .from('piece_likes')
      .insert({
        piece_id: pieceId,
        likes: 1,
      })
      .select()
      .single()

    if (error) {
      console.error('Errore creazione like:', error)
      return null
    }

    return data.likes
  }

  const newLikes = existingRow.likes + 1

  const { data, error } = await supabase
    .from('piece_likes')
    .update({
      likes: newLikes,
    })
    .eq('piece_id', pieceId)
    .select()
    .single()

  if (error) {
    console.error('Errore aggiornamento like:', error)
    return null
  }

  return data.likes
}
