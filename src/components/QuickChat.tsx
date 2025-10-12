import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EMOJIS = ['🚀', '💎', '🔥', '😎', '💪', '👍', '🎯', '⚡'];

const QUICK_MESSAGES = [
  'Good luck! 🍀',
  'Nice trade! 👏',
  'Let\'s go! 🚀',
  'To the moon! 🌙',
  'HODL! 💎',
  'GG! 🎮'
];

export const QuickChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const sendMessage = (message: string) => {
    toast({
      title: "Message sent",
      description: message,
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen && (
        <Card className="glass-card p-4 mb-2 w-64 animate-scale-in">
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground">EMOJIS</h4>
              <div className="grid grid-cols-4 gap-2">
                {EMOJIS.map((emoji, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xl h-10 hover:scale-110 transition-transform"
                    onClick={() => sendMessage(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground">QUICK MESSAGES</h4>
              <div className="space-y-1">
                {QUICK_MESSAGES.map((msg, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs justify-start"
                    onClick={() => sendMessage(msg)}
                  >
                    <Send className="w-3 h-3 mr-2" />
                    {msg}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 shadow-lg"
        size="icon"
      >
        <MessageSquare className="w-5 h-5" />
      </Button>
    </div>
  );
};
