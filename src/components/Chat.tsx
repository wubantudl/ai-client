import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useStore } from '../stores';
import { chat, chatStream, getModels } from '../services/api';
import type { ChatMessage } from '../types';

export const Chat: React.FC = () => {
  const { conversations, activeConversationId, models, activeModelId, setActiveModel, addMessage, updateLastMessage } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConversationId || !activeModelId) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    addMessage(activeConversationId, userMessage);
    setInput('');
    setLoading(true);

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    addMessage(activeConversationId, assistantMessage);

    try {
      const messages = [...(activeConversation?.messages || []), userMessage];
      
      await chatStream(
        activeModelId,
        messages,
        (chunk) => {
          updateLastMessage(activeConversationId, chunk);
        },
        () => {
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Chat error:', error);
      updateLastMessage(activeConversationId, '发生错误，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center px-4 gap-4">
        <select
          value={activeModelId || ''}
          onChange={(e) => setActiveModel(e.target.value)}
          className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeConversation?.messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="输入消息..."
            className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
