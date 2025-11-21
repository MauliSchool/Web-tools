import { Tool } from './types';

export const INITIAL_TOOLS: Tool[] = [
  // --- PDF Tools ---
  {
    id: '1',
    name: 'PDF Compressor',
    description: 'Reduce PDF file size while maintaining quality.',
    category: 'PDF',
    slug: 'pdf-compressor',
    iconName: 'FileCode',
    actionType: 'client-process',
    inputs: [{ name: 'file', label: 'Upload PDF', type: 'file', accept: '.pdf' }]
  },
  {
    id: '2',
    name: 'PDF to JPG',
    description: 'Convert PDF pages into high-quality JPG images.',
    category: 'PDF',
    slug: 'pdf-to-jpg',
    iconName: 'Image',
    actionType: 'client-process',
    inputs: [{ name: 'file', label: 'Upload PDF', type: 'file', accept: '.pdf' }]
  },
  
  // --- Image Tools ---
  {
    id: '3',
    name: 'Image Resize',
    description: 'Resize images to specific dimensions quickly.',
    category: 'Image',
    slug: 'image-resize',
    iconName: 'Maximize',
    actionType: 'client-process',
    inputs: [
      { name: 'file', label: 'Upload Image', type: 'file', accept: 'image/*' },
      { name: 'width', label: 'Width (px)', type: 'number', placeholder: '800' },
      { name: 'height', label: 'Height (px)', type: 'number', placeholder: '600' }
    ]
  },
  {
    id: '4',
    name: 'Image Compressor',
    description: 'Optimize images for web use.',
    category: 'Image',
    slug: 'image-compressor',
    iconName: 'Minimize',
    actionType: 'client-process',
    inputs: [
       { name: 'file', label: 'Upload Image', type: 'file', accept: 'image/*' },
       { name: 'quality', label: 'Quality (1-100)', type: 'number', placeholder: '80' }
    ]
  },

  // --- AI Tools ---
  {
    id: '5',
    name: 'AI Text Rewriter',
    description: 'Rewrite text to be more professional or creative.',
    category: 'AI',
    slug: 'ai-text-rewriter',
    iconName: 'PenTool',
    actionType: 'ai-text',
    systemPrompt: 'Rewrite the following text to be clear, concise, and professional. Improve grammar and flow.',
    inputs: [{ name: 'prompt', label: 'Text to Rewrite', type: 'textarea', placeholder: 'Paste text here...' }]
  },
  {
    id: '6',
    name: 'AI Summarizer',
    description: 'Summarize long articles or documents instantly.',
    category: 'AI',
    slug: 'ai-summarizer',
    iconName: 'FileText',
    actionType: 'ai-text',
    systemPrompt: 'Summarize the following content into key bullet points.',
    inputs: [{ name: 'prompt', label: 'Text to Summarize', type: 'textarea', placeholder: 'Paste long text here...' }]
  },
  {
    id: '7',
    name: 'AI Email Generator',
    description: 'Generate professional emails for any purpose.',
    category: 'AI',
    slug: 'ai-email-generator',
    iconName: 'Mail',
    actionType: 'ai-text',
    systemPrompt: 'Write a professional email based on the following requirements. Include a subject line.',
    inputs: [{ name: 'prompt', label: 'Email Description (e.g., Ask boss for leave)', type: 'textarea' }]
  },
  {
    id: '8',
    name: 'AI Resume Builder',
    description: 'Create a resume structure based on your details.',
    category: 'AI',
    slug: 'ai-resume-builder',
    iconName: 'UserCheck',
    actionType: 'ai-text',
    systemPrompt: 'Create a professional resume markdown structure based on these details. Use headers and bullet points.',
    inputs: [{ name: 'prompt', label: 'My Experience & Skills', type: 'textarea', placeholder: 'I am a software engineer with 5 years exp in React...' }]
  },

  // --- Student Tools ---
  {
    id: '9',
    name: 'CGPA to Percentage',
    description: 'Convert your CGPA to standard percentage.',
    category: 'Student',
    slug: 'cgpa-percentage',
    iconName: 'Calculator',
    actionType: 'calculation',
    inputs: [{ name: 'value', label: 'CGPA (out of 10)', type: 'number' }]
  },
  {
    id: '10',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days.',
    category: 'Student',
    slug: 'age-calculator',
    iconName: 'Clock',
    actionType: 'calculation',
    inputs: [{ name: 'date', label: 'Date of Birth', type: 'text', placeholder: 'YYYY-MM-DD' }]
  },
];

export const CATEGORIES: {id: string, label: string, color: string}[] = [
  { id: 'PDF', label: 'PDF Tools', color: 'bg-red-100 text-red-600' },
  { id: 'Image', label: 'Image Tools', color: 'bg-blue-100 text-blue-600' },
  { id: 'AI', label: 'AI Tools', color: 'bg-purple-100 text-purple-600' },
  { id: 'Student', label: 'Student Tools', color: 'bg-green-100 text-green-600' },
];
