import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hfbwiqoheyzkzminoebb.supabase.co'
const supabaseAnonKey = 'sb_publishable_amHR9NdyAtRSNcxw0ljMBA_OFyBE8_I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
