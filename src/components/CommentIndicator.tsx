import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CommentIndicatorProps {
  x: number
  y: number
  threadId: string
  commentCount: number
  onClick: () => void
}

export const CommentIndicator = ({ x, y, threadId, commentCount, onClick }: CommentIndicatorProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="absolute z-10 pointer-events-auto"
      style={{
        left: x - 12,
        top: y - 12,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={`
          w-6 h-6 rounded-full p-0 border-2 shadow-lg transition-all duration-200
          ${threadId.startsWith('flowcode-')
            ? 'border-blue-500 bg-blue-500 hover:bg-blue-600'
            : threadId.startsWith('obness-')
            ? 'border-green-500 bg-green-500 hover:bg-green-600'
            : 'border-gray-500 bg-gray-500 hover:bg-gray-600'
          }
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
      >
        <MessageCircle className="w-3 h-3 text-white" />
      </Button>

      {commentCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {commentCount > 9 ? '9+' : commentCount}
        </div>
      )}
    </div>
  )
}