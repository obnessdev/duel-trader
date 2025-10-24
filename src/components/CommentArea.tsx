import { useState, useRef } from 'react'
import { CommentThread } from './CommentThread'

interface CommentData {
  id: string
  x: number
  y: number
}

interface CommentAreaProps {
  children: React.ReactNode
  className?: string
}

export const CommentArea = ({ children, className = '' }: CommentAreaProps) => {
  const [comments, setComments] = useState<CommentData[]>([])
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; show: boolean }>({
    x: 0,
    y: 0,
    show: false
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      show: true
    })
  }

  const handleContextMenuClose = () => {
    setContextMenu(prev => ({ ...prev, show: false }))
  }

  const addComment = (author: 'flowcode' | 'obness') => {
    if (!contextMenu.show) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = contextMenu.x - rect.left - window.scrollX
    const y = contextMenu.y - rect.top - window.scrollY

    const newComment: CommentData = {
      id: `${author}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y
    }

    setComments(prev => [...prev, newComment])
    handleContextMenuClose()
  }

  // Close context menu on click outside
  const handleClick = (e: React.MouseEvent) => {
    if (contextMenu.show) {
      handleContextMenuClose()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full h-full"
        onContextMenu={handleRightClick}
        onClick={handleClick}
      >
        {children}

        {/* Render all comment threads */}
        {comments.map((comment) => (
          <CommentThread
            key={comment.id}
            threadId={comment.id}
            x={comment.x}
            y={comment.y}
          />
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={handleContextMenuClose}
          />

          {/* Menu */}
          <div
            className="fixed z-50 bg-background border border-border/50 rounded-lg shadow-lg py-2 min-w-48"
            style={{
              left: contextMenu.x,
              top: contextMenu.y
            }}
          >
            <button
              onClick={() => addComment('flowcode')}
              className="w-full text-left px-4 py-2 hover:bg-muted/50 flex items-center gap-2 text-sm"
            >
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              Comentar como Flowcode
            </button>

            <button
              onClick={() => addComment('obness')}
              className="w-full text-left px-4 py-2 hover:bg-muted/50 flex items-center gap-2 text-sm"
            >
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
              Comentar como Obness
            </button>
          </div>
        </>
      )}
    </div>
  )
}