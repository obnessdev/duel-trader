import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useCommentCount = (threadId: string) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!threadId) return

    fetchCount()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`count-${threadId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comentarios',
        filter: `id_thread=eq.${threadId}`
      }, () => {
        fetchCount()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [threadId])

  const fetchCount = async () => {
    try {
      const { count, error } = await supabase
        .from('comentarios')
        .select('*', { count: 'exact', head: true })
        .eq('id_thread', threadId)

      if (error) throw error
      setCount(count || 0)
    } catch (error) {
      console.error('Error fetching comment count:', error)
    }
  }

  return count
}