import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { X, Send, User } from 'lucide-react'
import { supabase, Comentario } from '@/lib/supabase'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  threadId: string
  x: number
  y: number
}

export const CommentModal = ({ isOpen, onClose, threadId, x, y }: CommentModalProps) => {
  const [comments, setComments] = useState<Comentario[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchComments()
      // Set username based on threadId
      if (!userName) {
        if (threadId.startsWith('flowcode-')) {
          setUserName('Flowcode')
        } else if (threadId.startsWith('obness-')) {
          setUserName('Obness')
        } else {
          setUserName(`Trader${Math.floor(Math.random() * 10000)}`)
        }
      }
    }
  }, [isOpen, threadId])

  useEffect(() => {
    if (!isOpen) return

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`comments-${threadId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comentarios',
        filter: `id_thread=eq.${threadId}`
      }, () => {
        fetchComments()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [isOpen, threadId])

  const fetchComments = async () => {
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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('comentarios')
        .insert({
          id_thread: threadId,
          conteudo: newComment.trim(),
          responsavel: userName
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

  if (!isOpen) return null

  // Calculate modal position
  const modalX = Math.min(x + 20, window.innerWidth - 350)
  const modalY = Math.min(y, window.innerHeight - 400)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Modal */}
      <Card
        className="fixed z-50 w-80 max-h-96 bg-background border-2 border-blue-400 shadow-2xl"
        style={{
          left: modalX,
          top: modalY
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-400">💬 Thread de Comentários</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Comments List */}
          <div className="max-h-48 overflow-y-auto mb-4 space-y-3">
            {comments.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm">
                Seja o primeiro a comentar! 🚀
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">
                      {comment.responsavel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.conteudo}</p>
                </div>
              ))
            )}
          </div>

          {/* New Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Digite seu comentário..."
              className="resize-none text-sm"
              rows={2}
              maxLength={280}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/280
              </span>
              <Button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4 mr-1" />
                Enviar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  )
}