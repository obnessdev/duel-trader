import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Comentario {
  id: number
  created_at: string
  id_thread: string | null
  conteudo: string | null
  responsavel: string | null
}

export interface Database {
  public: {
    Tables: {
      comentarios: {
        Row: Comentario
        Insert: Omit<Comentario, 'id' | 'created_at'>
        Update: Partial<Omit<Comentario, 'id' | 'created_at'>>
      }
    }
  }
}