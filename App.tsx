
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { INITIAL_TOOLS, CATEGORIES } from './constants';
import { Tool, ToolCategory, ToolInput, ProcessResult } from './types';
import { generateAiContent } from './services/geminiService';
import { processClientImage, calculateStudentData, mockPdfProcess } from './utils/processHelper';

// --- Context ---
interface AppContextType {
  tools: Tool[];
  addTool: (tool: Tool) => void;
  deleteTool: (id: string) => void;
}

const AppContext = createContext<AppContextType>({ tools: [], addTool: () => {}, deleteTool: () => {} });

const useApp = () => useContext(AppContext);

// --- Components ---

const Header = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Icons.Zap size={24} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">QuickTools Hub</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
             <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
               Dashboard
             </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-600">
              <Icons.Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-auto">
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <p className="text-gray-500 text-sm">© 2024 QuickTools Hub. Built with Gemini API.</p>
      <div className="flex gap-4 text-gray-400">
         <Icons.Twitter size={18} />
         <Icons.Linkedin size={18} />
      </div>
    </div>
  </footer>
);

const ToolCard = ({ tool }: { tool: Tool }) => {
  // Dynamic Icon
  const IconComponent = (Icons as any)[tool.iconName] || Icons.Box;

  return (
    <Link to={`/${tool.slug}`} className="group relative block h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
      <div className="relative flex flex-col h-full bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-transparent transition-all">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gray-50 text-primary group-hover:bg-primary/10 group-hover:text-primary transition-colors`}>
          <IconComponent size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
        <p className="text-gray-500 text-sm flex-grow">{tool.description}</p>
        <div className="mt-4 flex items-center text-primary text-sm font-medium">
          Open Tool <Icons.ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const { tools } = useApp();
  const [filter, setFilter] = useState<ToolCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredTools = tools.filter(t => {
    const matchesCategory = filter === 'All' || t.category === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Free Online Tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Everyone</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Compress PDFs, edit images, generate AI content, and calculate grades all in one place.
        </p>
        
        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icons.Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition sm:text-sm"
            placeholder="Search for a tool (e.g. 'Resize', 'Resume')"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'All' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            All Tools
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as ToolCategory)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat.id ? 'bg-primary text-white shadow-lg ring-2 ring-offset-2 ring-primary' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
          {filteredTools.length === 0 && (
             <div className="col-span-full text-center py-20 text-gray-500">
               <Icons.Inbox className="mx-auto h-12 w-12 text-gray-300 mb-4" />
               <p>No tools found matching your criteria.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToolView = () => {
  const { slug } = useParams();
  const { tools } = useApp();
  const tool = tools.find(t => t.slug === slug);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);

  if (!tool) return <div className="p-20 text-center">Tool not found</div>;

  const IconComponent = (Icons as any)[tool.iconName] || Icons.Box;

  const handleInputChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let res: ProcessResult = { success: false };

      if (tool.actionType.startsWith('ai-')) {
        const prompt = formValues['prompt'];
        if (!prompt) throw new Error("Prompt is required");
        const text = await generateAiContent(prompt, tool.systemPrompt);
        res = { success: true, data: text };
      } 
      else if (tool.actionType === 'client-process') {
         if (tool.slug.includes('image')) {
            const file = formValues['file'];
            if (!file) throw new Error("File required");
            const type = tool.slug.includes('compress') ? 'compress' : 'resize';
            const width = formValues['width'] ? parseInt(formValues['width']) : undefined;
            const height = formValues['height'] ? parseInt(formValues['height']) : undefined;
            const quality = formValues['quality'] ? parseInt(formValues['quality']) : undefined;
            res = await processClientImage(file, type, { width, height, quality });
         } else if (tool.category === 'PDF') {
             const file = formValues['file'];
             if(!file) throw new Error("File required");
             res = await mockPdfProcess(file, tool.slug);
         }
      } 
      else if (tool.actionType === 'calculation') {
          res = calculateStudentData(tool.slug, formValues);
      }

      setResult(res);
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
      if (result?.data instanceof Blob) {
          const url = URL.createObjectURL(result.data);
          const a = document.createElement('a');
          a.href = url;
          a.download = result.downloadName || 'download';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
        <Icons.ArrowLeft size={16} className="mr-1" /> Back to Tools
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
             <IconComponent size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
            <p className="text-gray-500">{tool.description}</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {tool.inputs.map((input) => (
              <div key={input.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{input.label}</label>
                {input.type === 'textarea' ? (
                  <textarea
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary min-h-[120px]"
                    placeholder={input.placeholder}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                  />
                ) : input.type === 'file' ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                    <input
                       type="file"
                       id={input.name}
                       accept={input.accept}
                       className="hidden"
                       onChange={(e) => handleInputChange(input.name, e.target.files?.[0])}
                    />
                    <label htmlFor={input.name} className="cursor-pointer flex flex-col items-center">
                        <Icons.UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                            {formValues[input.name] ? (formValues[input.name] as File).name : "Click to upload"}
                        </span>
                    </label>
                  </div>
                ) : (
                  <input
                    type={input.type}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder={input.placeholder}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icons.Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Processing...
                </>
              ) : (
                'Run Tool'
              )}
            </button>
          </form>

          {/* Result Section */}
          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  {result.success ? <Icons.CheckCircle className="text-green-500"/> : <Icons.XCircle className="text-red-500"/>}
                  Result
              </h3>
              
              {!result.success && <p className="text-red-600">{result.error}</p>}

              {result.success && (
                  <div>
                      {typeof result.data === 'string' ? (
                          <div className="bg-white p-4 rounded border border-gray-200 whitespace-pre-wrap text-gray-700 font-mono text-sm">
                              {result.data}
                          </div>
                      ) : (
                          <div className="text-center">
                              <p className="text-sm text-gray-500 mb-4">Your file is ready.</p>
                              <button 
                                onClick={downloadFile}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                              >
                                  <Icons.Download className="mr-2 h-4 w-4" /> Download Result
                              </button>
                          </div>
                      )}
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
    const { tools, addTool, deleteTool } = useApp();
    const [newToolName, setNewToolName] = useState('');
    const [newToolSlug, setNewToolSlug] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const newTool: Tool = {
            id: Date.now().toString(),
            name: newToolName,
            description: 'Custom added tool',
            category: 'Student',
            slug: newToolSlug || newToolName.toLowerCase().replace(/\s+/g, '-'),
            iconName: 'Wrench',
            actionType: 'calculation',
            inputs: [{ name: 'val', label: 'Input', type: 'text' }]
        };
        addTool(newTool);
        setNewToolName('');
        setNewToolSlug('');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Tool Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Add Quick Tool</h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tool Name</label>
                            <input 
                                value={newToolName} 
                                onChange={e => setNewToolName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                                required 
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                            <input 
                                value={newToolSlug} 
                                onChange={e => setNewToolSlug(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90">
                            Add Tool
                        </button>
                    </form>
                </div>

                {/* Tool List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Existing Tools ({tools.length})</h2>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {tools.map(tool => (
                            <li key={tool.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                                    <p className="text-sm text-gray-500">/{tool.slug} • {tool.category}</p>
                                </div>
                                <button 
                                    onClick={() => deleteTool(tool.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}

const App = () => {
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);

  const addTool = (tool: Tool) => setTools([...tools, tool]);
  const deleteTool = (id: string) => setTools(tools.filter(t => t.id !== id));

  return (
    <AppContext.Provider value={{ tools, addTool, deleteTool }}>
      <HashRouter>
        <AppLayout>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/:slug" element={<ToolView />} />
            </Routes>
        </AppLayout>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
