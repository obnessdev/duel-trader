import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, User } from 'lucide-react'
import { supabase, Comment } from '@/lib/supabase'

export const CommentSystem = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchComments()

    if (!supabase) return

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments'
      }, () => {
        fetchComments()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchComments = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !supabase) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          user_id: 'anonymous',
          username: `Trader${Math.floor(Math.random() * 10000)}`
        })

      if (error) throw error

      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg rounded-full w-12 h-12"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      ) : (
        <Card className="w-80 h-96 bg-background border-2 border-blue-400 shadow-2xl flex flex-col">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-semibold text-blue-400">💬 Chat da Comunidade</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!supabase ? (
              <div className="text-center text-muted-foreground text-sm">
                💬 Chat desabilitado (configure Supabase)
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm">
                Seja o primeiro a comentar! 🚀
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">
                      {comment.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Digite seu comentário..."
                className="flex-1 resize-none text-sm"
                rows={2}
                maxLength={280}
              />
              <Button
                type="submit"
                disabled={isLoading || !newComment.trim() || !supabase}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {newComment.length}/280 caracteres
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}