import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Direction } from '@/types/trading';

interface TradeNotification {
  id: string;
  username: string;
  avatar: string;
  direction: Direction;
  amount: number;
  timestamp: number;
}

interface TradeNotificationsProps {
  onNewTrade?: (direction: Direction, amount: number) => void;
}

export const TradeNotifications = ({ onNewTrade }: TradeNotificationsProps) => {
  const [notifications, setNotifications] = useState<TradeNotification[]>([]);

  useEffect(() => {
    // Simulate random trades from other users
    const generateRandomTrade = () => {
      const usernames = ['Rafael Terra', 'Ana Silva', 'João Santos', 'Maria Costa', 'Pedro Lima'];
      const notification: TradeNotification = {
        id: crypto.randomUUID(),
        username: usernames[Math.floor(Math.random() * usernames.length)],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
        direction: Math.random() > 0.5 ? 'CALL' : 'PUT',
        amount: Math.floor(Math.random() * 100) + 10,
        timestamp: Date.now()
      };

      setNotifications(prev => [...prev.slice(-2), notification]);
      
      // Remove after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    };

    const interval = setInterval(generateRandomTrade, 8000);
    return () => clearInterval(interval);
  }, []);

  // Listen for new trades from parent
  useEffect(() => {
    if (!onNewTrade) return;
    
    const handleTrade = (direction: Direction, amount: number) => {
      const notification: TradeNotification = {
        id: crypto.randomUUID(),
        username: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        direction,
        amount,
        timestamp: Date.now()
      };

      setNotifications(prev => [...prev.slice(-2), notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    };
  }, [onNewTrade]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="flex items-center gap-3 glass-card p-3 rounded-lg animate-slide-in-right pointer-events-auto"
        >
          <img 
            src={notif.avatar} 
            alt={notif.username}
            className="w-10 h-10 rounded-full border-2 border-primary/30"
          />
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${
              notif.direction === 'CALL' ? 'bg-success/20' : 'bg-destructive/20'
            }`}>
              {notif.direction === 'CALL' ? (
                <ArrowUp className="w-4 h-4 text-success" />
              ) : (
                <ArrowDown className="w-4 h-4 text-destructive" />
              )}
            </div>
            <div className="text-xs">
              <div className="font-semibold">{notif.username}</div>
              <div className="text-muted-foreground">
                {notif.direction} ${notif.amount}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
