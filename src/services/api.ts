import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import type { ModelConfig, ChatMessage, SkillInfo, MCPServerConfig } from '../types';

export async function getModels(): Promise<ModelConfig[]> {
  return await invoke<ModelConfig[]>('get_models');
}

export async function saveModels(models: ModelConfig[]): Promise<void> {
  return await invoke('save_model_config', { models });
}

export async function chat(modelId: string, messages: ChatMessage[]): Promise<string> {
  const response = await invoke<{ content: string }>('chat', { modelId, messages });
  return response.content;
}

export async function chatStream(
  modelId: string, 
  messages: ChatMessage[],
  onChunk: (content: string) => void,
  onDone: () => void
): Promise<void> {
  const unlisten = await listen<{ content: string }>('stream-chunk', (event) => {
    onChunk(event.payload.content);
  });
  
  const unlistenDone = await listen('stream-done', () => {
    onDone();
  });

  try {
    await invoke('chat_stream', { modelId, messages });
  } finally {
    unlisten();
    unlistenDone();
  }
}

export async function listSkills(): Promise<SkillInfo[]> {
  return await invoke<SkillInfo[]>('list_skills');
}

export async function importSkill(sourcePath: string): Promise<SkillInfo> {
  return await invoke<SkillInfo>('import_skill', { sourcePath });
}

export async function importSkillFromGitHub(repoUrl: string): Promise<SkillInfo> {
  return await invoke<SkillInfo>('import_from_github', { repoUrl });
}

export async function deleteSkill(path: string): Promise<void> {
  return await invoke('delete_skill', { path });
}

export async function toggleSkill(path: string, enabled: boolean): Promise<void> {
  return await invoke('toggle_skill', { path, enabled });
}

export async function getSkillPath(): Promise<string> {
  return await invoke<string>('get_skill_path');
}

export async function listMCPServers(): Promise<MCPServerConfig[]> {
  return await invoke<MCPServerConfig[]>('list_servers');
}

export async function connectMCPServer(config: MCPServerConfig): Promise<any> {
  return await invoke('connect_server', { config });
}

export async function disconnectMCPServer(name: string): Promise<void> {
  return await invoke('disconnect_server', { name });
}

export async function callMCPTool(
  serverName: string, 
  toolName: string, 
  args: Record<string, any>
): Promise<any> {
  return await invoke('call_tool', { serverName, toolName, arguments: args });
}
