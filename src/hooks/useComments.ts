import { useState, useEffect } from 'react'
import { supabase, Comentario } from '@/lib/supabase'

export const useComments = (threadId: string) => {
  const [comments, setComments] = useState<Comentario[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (threadId) {
      fetchComments()
    }
  }, [threadId])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('id_thread', threadId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addComment = async (content: string, username: string) => {
    try {
      const { error } = await supabase
        .from('comentarios')
        .insert({
          id_thread: threadId,
          conteudo: content,
          responsavel: username
        })

      if (error) throw error
      await fetchComments() // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  return {
    comments,
    isLoading,
    addComment,
    refetch: fetchComments
  }
}