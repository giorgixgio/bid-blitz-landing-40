/**
 * STREAM CHAT COMPONENT
 * =====================
 * 
 * Live chat simulation for auction with:
 * - Dummy users commenting every 2 seconds
 * - Auction-context messages
 * - Stream-like UI design
 * - Auto-scroll to latest messages
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isVip?: boolean;
  isModerator?: boolean;
}

const StreamChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(127);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Dummy usernames pool
  const dummyUsers = [
    'nika_auction', 'bidmaster99', 'mari_collector', 'luka_deals', 'ana_hunter', 
    'saba_coins', 'nino_bidder', 'giorgi_fast', 'keti_smart', 'temo_lucky',
    'sophie_win', 'alex_pro', 'maka_queen', 'oto_beast', 'nata_sharp',
    'vano_quick', 'elene_fast', 'goga_rich', 'tamar_cool', 'beqa_strong'
  ];

  // VIP and moderator users (small percentage)
  const vipUsers = ['bidmaster99', 'alex_pro', 'sophie_win'];
  const moderators = ['admin_nika', 'mod_mari'];

  // Auction-context message templates
  const messageTemplates = [
    "ეს ფასი ძალიან კარგია! 💰",
    "ვინ მეტ-ნაკლებად იბიდებს? 🤔",
    "სამსუნგი S25 Ultra ღირს! 📱",
    "ბოლო წამები! ვინ იგებს? ⏰",
    "ეს აუქციონი ღირს ყურადღების 🔥",
    "კიდევ 10 წამია დარჩა! ⚡",
    "ამ ფასად ვერ ვიშოვი ეს ტელეფონი 😍",
    "ბედნიერი ვინც მოიგებს 🍀",
    "წავიდე ბიდი? კი თუ არა? 🤷‍♂️",
    "კარგი შანსია ახლა! 💪",
    "ვაუ, რა სწრაფად იზრდება ფასი! 📈",
    "ყველას გისურვებთ წარმატებას! 🙌",
    "ეს ტელეფონი ტოპია! 👑",
    "იმედოვნებ გავიმარჯვებ 🎯",
    "ბევრი ვარ მოწიული 😅",
    "ძალიან კარგი დილაა ბიდისთვის ☀️",
    "პირველად ვცდილობ აუქციონში 🆕",
    "რა კარგი ხალხია აქ! ❤️",
    "სამსუნგის ახალი მოდელი 🚀",
    "ბედი გამიღიმოს! 🌟"
  ];

  // Emoji reactions
  const reactions = ['🔥', '💰', '⚡', '👏', '😍', '🎯', '💪', '🚀', '👑', '🍀'];

  // Generate random message
  const generateRandomMessage = (): ChatMessage => {
    const username = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
    const isVip = vipUsers.includes(username);
    const isModerator = moderators.includes(username);
    
    // 20% chance for just emoji, 80% for text message
    let message;
    if (Math.random() < 0.2) {
      message = reactions[Math.floor(Math.random() * reactions.length)];
    } else {
      message = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
    }

    return {
      id: Date.now().toString() + Math.random(),
      username,
      message,
      timestamp: new Date(),
      isVip,
      isModerator
    };
  };

  // Auto-scroll to bottom within chat container only
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add dummy messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newMessage = generateRandomMessage();
      setMessages(prev => {
        const newMessages = [...prev, newMessage];
        // Keep only last 50 messages for performance
        return newMessages.slice(-50);
      });

      // Randomly update online users count
      if (Math.random() < 0.3) {
        setOnlineUsers(prev => prev + (Math.random() < 0.5 ? 1 : -1));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Initial messages
  useEffect(() => {
    const initialMessages = Array.from({ length: 8 }, () => generateRandomMessage());
    setMessages(initialMessages);
  }, []);

  return (
    <Card className="h-96 flex flex-col">
      {/* Chat Header */}
      <div className="p-3 border-b bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">ლაივ ჩატი</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{onlineUsers}</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2 text-xs">
            <Avatar className="w-6 h-6 flex-shrink-0">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {msg.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <span className={`font-medium truncate ${
                  msg.isModerator ? 'text-destructive' : 
                  msg.isVip ? 'text-primary' : 'text-foreground'
                }`}>
                  {msg.username}
                </span>
                {msg.isModerator && (
                  <Badge variant="destructive" className="text-[8px] px-1 py-0 h-4">
                    MOD
                  </Badge>
                )}
                {msg.isVip && !msg.isModerator && (
                  <Badge variant="secondary" className="text-[8px] px-1 py-0 h-4 bg-primary/20 text-primary">
                    VIP
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground break-words">{msg.message}</p>
            </div>
            <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">
              {msg.timestamp.toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Placeholder */}
      <div className="p-3 border-t bg-muted/10">
        <div className="text-xs text-muted-foreground text-center py-2 px-4 bg-muted/30 rounded-md">
          რეგისტრაცია საჭიროა ჩატისთვის
        </div>
      </div>
    </Card>
  );
};

export default StreamChat;
