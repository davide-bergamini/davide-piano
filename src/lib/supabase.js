import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ijiallyxrxewbmjmqaud.supabase.co'
const supabaseAnonKey = 'sb_publishable_cCsEYP_I29SrQ7e3tk4nRA_Z2b88WBv'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
