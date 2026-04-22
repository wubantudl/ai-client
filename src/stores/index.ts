import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModelConfig, Conversation, ChatMessage, SkillInfo, MCPServerConfig } from '../types';

interface AppState {
  models: ModelConfig[];
  activeModelId: string | null;
  setModels: (models: ModelConfig[]) => void;
  setActiveModel: (modelId: string) => void;
  
  conversations: Conversation[];
  activeConversationId: string | null;
  addConversation: () => void;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateLastMessage: (conversationId: string, content: string) => void;
  
  skills: SkillInfo[];
  setSkills: (skills: SkillInfo[]) => void;
  
  mcpServers: MCPServerConfig[];
  setMCPServers: (servers: MCPServerConfig[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      models: [],
      activeModelId: null,
      setModels: (models) => set({ models }),
      setActiveModel: (modelId) => set({ activeModelId: modelId }),
      
      conversations: [],
      activeConversationId: null,
      addConversation: () => {
        const newConversation: Conversation = {
          id: crypto.randomUUID(),
          title: '新对话',
          messages: [],
          modelId: get().activeModelId || 'deepseek-chat',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: newConversation.id,
        }));
      },
      deleteConversation: (id) => set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
        activeConversationId: state.activeConversationId === id 
          ? (state.conversations[0]?.id || null) 
          : state.activeConversationId,
      })),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      addMessage: (conversationId, message) => set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, message],
                updatedAt: new Date(),
                title: c.messages.length === 0 && message.role === 'user' 
                  ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                  : c.title,
              }
            : c
        ),
      })),
      updateLastMessage: (conversationId, content) => set((state) => ({
        conversations: state.conversations.map((c) => {
          if (c.id !== conversationId) return c;
          const messages = [...c.messages];
          if (messages.length > 0) {
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              content: messages[messages.length - 1].content + content,
            };
          }
          return { ...c, messages, updatedAt: new Date() };
        }),
      })),
      
      skills: [],
      setSkills: (skills) => set({ skills }),
      
      mcpServers: [],
      setMCPServers: (servers) => set({ mcpServers: servers }),
    }),
    {
      name: 'ai-client-storage',
    }
  )
);
