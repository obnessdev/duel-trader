import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Smile, TrendingUp, TrendingDown, Trophy, XCircle, X, MessageSquare, MessageCircle, RotateCcw } from 'lucide-react';
import { ChatMessage } from '@/types/trading';
import { cn } from '@/lib/utils';

interface LiveChatProps {
  messages: ChatMessage[];
  onSendEmoji: (emoji: string) => void;
  onSendMessage?: (message: string) => void;
  isEmbedded?: boolean;
}

const EMOJIS = ['🚀', '💎', '🔥', '😎', '💪', '👍', '🎯', '⚡', '📈', '📉', '💰', '🎉', '😱', '🤑', '😢', '👏'];

const PREDEFINED_MESSAGES = [
  'Boa sorte pessoal! 🍀',
  'Vamos que vamos! 💪',
  'É nóis na fita! 🚀',
  'Quem tá ganhando hoje? 🤑',
  'Mercado doido hoje! 📈',
  'Hold strong! 💎',
  'Moon incoming! 🌙',
  'Aposta inteligente aí! 🧠',
  'Que movimento foi esse?! 😱',
  'Profit garantido! 💰',
  'Bora pro green! 🟢',
  'Red não existe! ❌',
  'Analise técnica on! 📊',
  'Feeling de alta! ⬆️',
  'Tendência confirmada! ✅'
];

export const LiveChat = ({ messages, onSendEmoji, onSendMessage, isEmbedded = false }: LiveChatProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessagePicker, setShowMessagePicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para mensagens novas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderMessage = (msg: ChatMessage) => {
    switch (msg.type) {
      case 'bet':
        return (
          <div className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded transition-colors">
            {msg.data?.direction === 'CALL' ? (
              <TrendingUp className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs font-semibold text-foreground">{msg.username}</span>
                <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                apostou{' '}
                <span className={cn(
                  'font-bold',
                  msg.data?.direction === 'CALL' ? 'text-success' : 'text-destructive'
                )}>
                  ${msg.data?.amount?.toFixed(2)}
                </span>
                {' '}em{' '}
                <span className={cn(
                  'font-bold',
                  msg.data?.direction === 'CALL' ? 'text-success' : 'text-destructive'
                )}>
                  {msg.data?.direction}
                </span>
                {' '}({msg.data?.asset})
              </div>
            </div>
          </div>
        );

      case 'result':
        return (
          <div className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded transition-colors">
            {msg.data?.result === 'win' ? (
              <Trophy className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
            ) : msg.data?.result === 'refund' ? (
              <RotateCcw className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs font-semibold text-foreground">{msg.username}</span>
                <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="text-xs mt-0.5">
                {msg.data?.result === 'win' ? (
                  <span className="text-success font-bold">
                    GANHOU ${msg.data?.profit?.toFixed(2)} 💰🪙🎉
                  </span>
                ) : msg.data?.result === 'refund' ? (
                  <div className="space-y-1">
                    <span className="text-destructive font-bold">
                      PERDEU ${Math.abs(msg.data?.originalLoss || 0).toFixed(2)} 😔
                    </span>
                    <div>
                      <span className="text-blue-400 font-bold">
                        🤖 AI EQUALIZER REEMBOLSOU ${msg.data?.profit?.toFixed(2)} 🔄💙
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-destructive font-bold">
                    PERDEU ${Math.abs(msg.data?.profit || 0).toFixed(2)} 😔💸
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 'emoji':
        return (
          <div className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs font-semibold text-foreground">{msg.username}</span>
                <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="text-lg mt-0.5">
                {msg.content}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded transition-colors">
            <MessageCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs font-semibold text-foreground">{msg.username}</span>
                <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="text-xs text-foreground mt-0.5">
                {msg.content}
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="flex justify-center p-2">
            <div className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              {msg.content}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Se é embedded, sempre renderiza o chat completo
  if (isEmbedded) {
    return (
      <div className="h-full bg-background flex flex-col max-h-full overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/50 p-3 flex items-center justify-between bg-muted/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-bold">Chat ao Vivo</h3>
            <div className="text-[10px] text-muted-foreground">
              ({messages.length})
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-2" ref={scrollRef}>
          <div className="space-y-1">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-8 text-center">
                Nenhuma mensagem ainda. Seja o primeiro a apostar! 🚀
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id}>{renderMessage(msg)}</div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="border-t border-border/50 p-3 bg-muted/20">
            <div className="text-[10px] text-muted-foreground mb-2 font-semibold">
              ENVIAR EMOJI
            </div>
            <div className="grid grid-cols-8 gap-1">
              {EMOJIS.map((emoji, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-lg hover:scale-125 transition-transform"
                  onClick={() => {
                    onSendEmoji(emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Message Picker */}
        {showMessagePicker && (
          <div className="border-t border-border/50 p-3 bg-muted/20 max-h-48 overflow-y-auto">
            <div className="text-[10px] text-muted-foreground mb-3 font-semibold">
              MENSAGENS RÁPIDAS
            </div>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_MESSAGES.map((message, i) => (
                <button
                  key={i}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                  onClick={() => {
                    if (onSendMessage) {
                      onSendMessage(message);
                    }
                    setShowMessagePicker(false);
                  }}
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border/50 p-2 bg-muted/10 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowMessagePicker(false);
              }}
            >
              <Smile className="w-4 h-4 mr-2" />
              {showEmojiPicker ? 'Fechar' : 'Emoji'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowMessagePicker(!showMessagePicker);
                setShowEmojiPicker(false);
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {showMessagePicker ? 'Fechar' : 'Mensagem'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Modo floating (original)
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 rounded-full w-14 h-14 z-50"
        size="icon"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed right-4 bottom-4 w-80 h-[500px] bg-background/95 backdrop-blur border-border/50 flex flex-col z-50">
      {/* Header */}
      <div className="border-b border-border/50 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
          <h3 className="text-sm font-bold">Chat ao Vivo</h3>
          <div className="text-[10px] text-muted-foreground">
            ({messages.length})
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-2" ref={scrollRef}>
        <div className="space-y-1">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-8 text-center">
              Nenhuma mensagem ainda. Seja o primeiro a apostar! 🚀
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id}>{renderMessage(msg)}</div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="border-t border-border/50 p-3 bg-muted/20">
          <div className="text-[10px] text-muted-foreground mb-2 font-semibold">
            ENVIAR EMOJI
          </div>
          <div className="grid grid-cols-8 gap-1">
            {EMOJIS.map((emoji, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:scale-125 transition-transform"
                onClick={() => {
                  onSendEmoji(emoji);
                  setShowEmojiPicker(false);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Message Picker */}
      {showMessagePicker && (
        <div className="border-t border-border/50 p-3 bg-muted/20 max-h-48 overflow-y-auto">
          <div className="text-[10px] text-muted-foreground mb-3 font-semibold">
            MENSAGENS RÁPIDAS
          </div>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_MESSAGES.map((message, i) => (
              <button
                key={i}
                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                onClick={() => {
                  if (onSendMessage) {
                    onSendMessage(message);
                  }
                  setShowMessagePicker(false);
                }}
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border/50 p-2 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowMessagePicker(false);
          }}
        >
          <Smile className="w-4 h-4 mr-2" />
          {showEmojiPicker ? 'Fechar Emojis' : 'Enviar Emoji'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setShowMessagePicker(!showMessagePicker);
            setShowEmojiPicker(false);
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {showMessagePicker ? 'Fechar Mensagens' : 'Mensagem Rápida'}
        </Button>
      </div>
    </Card>
  );
};

