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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Send, Smile } from 'lucide-react';

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
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  // Quick emoji reactions for easy replies
  const quickEmojis = ['🔥', '💰', '⚡', '👏', '😍', '🎯', '💪', '🚀', '👑', '🍀'];
  
  // Extended emoji panel
  const allEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '🔥', '💰', '⚡', '👏', '🎯', '💪', '🚀', '👑', '🍀', '💎'
  ];

  // Generate random message
  const generateRandomMessage = (): ChatMessage => {
    const username = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
    const isVip = vipUsers.includes(username);
    const isModerator = moderators.includes(username);
    
    // 20% chance for just emoji, 80% for text message
    let message;
    if (Math.random() < 0.2) {
      message = quickEmojis[Math.floor(Math.random() * quickEmojis.length)];
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

  // Send user message
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '_user',
      username: 'შენ',
      message: text,
      timestamp: new Date(),
      isVip: true, // Make user appear as VIP
      isModerator: false
    };
    
    setMessages(prev => [...prev, userMessage].slice(-50));
    setMessageInput('');
    setShowEmojiPanel(false);
  };

  // Handle input submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(messageInput);
  };

  // Handle emoji click
  const handleEmojiClick = (emoji: string) => {
    if (showEmojiPanel) {
      sendMessage(emoji);
    } else {
      setMessageInput(prev => prev + emoji);
    }
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
    <Card className={`flex flex-col transition-all duration-300 overflow-hidden ${isExpanded ? 'h-96' : 'h-64'}`}>
      {/* Chat Header */}
      <div className="p-3 border-b bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-medium text-sm">🔥 ლაივ ჩატი</span>
          <Badge variant="secondary" className="text-xs px-2 py-0 bg-primary/20 text-primary">
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{onlineUsers}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 hover:bg-primary/10"
          >
            <span className="text-xs">{isExpanded ? '−' : '+'}</span>
          </Button>
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

      {/* Quick Emoji Reactions */}
      <div className="px-3 py-2 border-t bg-muted/5 overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <span className="text-xs text-muted-foreground mr-2 flex-shrink-0">სწრაფი:</span>
          {quickEmojis.map((emoji, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary/10 flex-shrink-0"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>

      {/* Emoji Panel */}
      {showEmojiPanel && (
        <div className="px-3 pb-2 border-t bg-muted/5 overflow-hidden">
          <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto scrollbar-thin">
            {allEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-primary/10"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-3 border-t bg-background overflow-hidden">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 relative min-w-0">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="დაწერე მესიჯი..."
              className="pr-10 text-sm w-full"
              maxLength={100}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setShowEmojiPanel(!showEmojiPanel)}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!messageInput.trim()}
            className="h-9 w-9 p-0 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default StreamChat;
