import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, MessageCircle, GripVertical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  onDataUpdate?: (data: any) => void;
}

export const ChatBot = ({ onDataUpdate }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I can help you analyze your dashboard data. Send me any questions or commands!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 384, height: 500 });
  const [isResizing, setIsResizing] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5678/webhook-test/Dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          timestamp: new Date().toISOString(),
          type: 'chat_message'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const botResponse = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse.message || botResponse.response || 'Response received',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // If the response contains data updates, trigger dashboard refresh
      if (botResponse.data || botResponse.update) {
        onDataUpdate?.(botResponse.data || botResponse.update);
        toast({
          title: "Dashboard Updated",
          description: "Data has been refreshed based on chatbot response",
          duration: 2000, // Closes after 3 seconds
        });
      }

    } catch (error) {
      console.error('Webhook error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I couldn\'t connect to the webhook. Please check if the service is running on localhost:5678.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to webhook service",
        variant: "destructive",
        duration: 2000, // Closes after 5 seconds
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: chatSize.width,
      startHeight: chatSize.height
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      
      const deltaX = resizeRef.current.startX - e.clientX;
      const deltaY = resizeRef.current.startY - e.clientY;
      
      const newWidth = Math.min(Math.max(resizeRef.current.startWidth + deltaX, 300), 600);
      const newHeight = Math.min(Math.max(resizeRef.current.startHeight + deltaY, 400), 500);
      
      setChatSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [chatSize]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="btn-neon rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-neon-cyan/50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={chatRef}>
      <Card 
        className="card-cyber flex flex-col shadow-2xl border-neon-cyan/30 relative"
        style={{ width: `${chatSize.width}px`, height: `${chatSize.height}px` }}
      >
        {/* Resize Handle */}
        <div
          className="absolute top-2 left-2 cursor-nw-resize p-1 rounded text-neon-cyan/50 hover:text-neon-cyan transition-colors"
          onMouseDown={handleResizeStart}
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neon-cyan/20">
          <div className="flex items-center gap-2 ml-6">
            <div className="pulse-glow w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-neon-cyan" />
            </div>
            <h3 className="font-orbitron text-neon-cyan">AI Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-neon-cyan"
          >
            ×
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-neon-cyan" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-neon-cyan/20 text-white border border-neon-cyan/30'
                      : 'bg-gray-800/50 text-gray-100 border border-gray-700/50'
                  }`}
                >
                  <p className="text-sm font-rajdhani">{message.content}</p>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-neon-pink/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-neon-pink" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-neon-cyan animate-pulse" />
                </div>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-neon-cyan/20">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="input-cyber flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="btn-neon px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};