import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus } from 'lucide-react'

interface ContextMenuProps {
  x: number
  y: number
  visible: boolean
  onClose: () => void
  onAddComment: () => void
}

export const ContextMenu = ({ x, y, visible, onClose, onAddComment }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div
      ref={menuRef}
      className="fixed bg-background border border-border rounded-md shadow-lg z-50 min-w-[150px]"
      style={{ left: x, top: y }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start px-3 py-2 text-sm text-foreground rounded-none hover:bg-accent hover:text-accent-foreground"
        onClick={() => {
          onAddComment()
          onClose()
        }}
      >
        <MessageSquarePlus className="w-4 h-4 mr-2" />
        Adicionar Comentário
      </Button>
    </div>
  )
}