import { useState } from 'react'
import { CommentIndicator } from './CommentIndicator'
import { CommentModal } from './CommentModal'
import { useCommentCount } from '@/hooks/useCommentCount'

interface CommentThreadProps {
  threadId: string
  x: number
  y: number
}

export const CommentThread = ({ threadId, x, y }: CommentThreadProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const commentCount = useCommentCount(threadId)

  return (
    <>
      <CommentIndicator
        x={x}
        y={y}
        threadId={threadId}
        commentCount={commentCount}
        onClick={() => setIsModalOpen(true)}
      />

      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        threadId={threadId}
        x={x}
        y={y}
      />
    </>
  )
}