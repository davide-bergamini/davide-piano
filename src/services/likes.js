
import { supabase } from './supabase'

const VISITOR_KEY = 'davide-piano-visitor-id'

function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_KEY)

  if (!visitorId) {
    visitorId = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, visitorId)
  }

  return visitorId
}

export async function fetchLikes(pieceIds) {
  if (!pieceIds.length) return {}

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

export async function fetchVisitorLikes(pieceIds) {
  if (!pieceIds.length) return []

  const visitorId = getVisitorId()

  const { data, error } = await supabase
    .from('piece_liked_visitors')
    .select('piece_id')
    .eq('visitor_id', visitorId)
    .in('piece_id', pieceIds)

  if (error) {
    console.error('Errore caricamento like personali:', error)
    return []
  }

  return data.map((row) => row.piece_id)
}

export async function incrementLike(pieceId) {
  const visitorId = getVisitorId()

  const { data, error } = await supabase.rpc('register_piece_like', {
    p_piece_id: pieceId,
    p_visitor_id: visitorId,
  })

  if (error) {
    console.error('Errore registrazione like:', error)
    return null
  }

  return data
}
