import { LucideIcon } from 'lucide-react';

export type ToolCategory = 'PDF' | 'Image' | 'AI' | 'Student';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  slug: string;
  iconName: string; // String reference to icon
  inputs: ToolInput[];
  actionType: 'ai-text' | 'ai-image' | 'client-process' | 'calculation';
  systemPrompt?: string; // For AI tools
}

export interface ToolInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'file' | 'select';
  options?: string[]; // For select inputs
  placeholder?: string;
  accept?: string; // For file inputs
}

export interface ProcessResult {
  success: boolean;
  data?: string | number | Blob;
  downloadName?: string;
  mimeType?: string;
  error?: string;
}
