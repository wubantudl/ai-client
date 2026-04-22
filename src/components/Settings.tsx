import React, { useState } from 'react';
import { X, Key, Globe, Server } from 'lucide-react';
import { useStore } from '../stores';
import { saveModels } from '../services/api';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { models, setModels } = useStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSaveModel = async (index: number, field: string, value: string) => {
    const newModels = [...models];
    newModels[index] = { ...newModels[index], [field]: value };
    setModels(newModels);
    await saveModels(newModels);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-[600px] max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">设置</h2>
          <button onClick={onClose} className="hover:bg-secondary p-1 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Server size={16} />
            模型配置
          </h3>
          
          <div className="space-y-3">
            {models.map((model, index) => (
              <div key={model.id} className="p-3 bg-secondary rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Base URL"
                    value={model.base_url}
                    onChange={(e) => handleSaveModel(index, 'base_url', e.target.value)}
                    className="bg-background border border-border rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="API Key"
                    value={model.api_key}
                    onChange={(e) => handleSaveModel(index, 'api_key', e.target.value)}
                    className="bg-background border border-border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
