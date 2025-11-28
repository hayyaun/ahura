import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { db, Design } from '../db/database';
import { createDefaultElement } from '../utils/elementUtils';

export default function Home() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      const allDesigns = await db.designs.orderBy('updatedAt').reverse().toArray();
      setDesigns(allDesigns);
    } catch (error) {
      console.error('Failed to load designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDesign = async () => {
    try {
      const newDesign: Omit<Design, 'id'> = {
        name: `Design ${designs.length + 1}`,
        elements: [createDefaultElement('div')],
        selectedElementId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const id = await db.designs.add(newDesign);
      navigate(`/editor/${id}`);
    } catch (error) {
      console.error('Failed to create design:', error);
    }
  };

  const handleOpenDesign = (id: number) => {
    navigate(`/editor/${id}`);
  };

  const handleDeleteDesign = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this design?')) {
      try {
        await db.designs.delete(id);
        loadDesigns();
      } catch (error) {
        console.error('Failed to delete design:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-gray-400">Loading designs...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1e1e1e] overflow-auto">
      <header className="bg-[#1e1e1e] border-b border-[#2d2d2d] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-300">Ahura</h1>
            <p className="text-sm text-gray-500 mt-1">Visual UI Builder</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-300">My Designs</h2>
          <button
            onClick={handleNewDesign}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            <Plus size={18} />
            New Design
          </button>
        </div>

        {designs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No designs yet</p>
            <button
              onClick={handleNewDesign}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Create Your First Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {designs.map((design) => (
              <div
                key={design.id}
                onClick={() => handleOpenDesign(design.id!)}
                className="bg-[#252525] border border-[#2d2d2d] rounded-lg p-4 cursor-pointer hover:border-[#3a3a3a] transition-colors group relative"
              >
                <div className="aspect-video bg-[#2d2d2d] rounded mb-3 flex items-center justify-center">
                  <div className="text-gray-500 text-xs">Preview</div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-300 truncate">
                      {design.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(design.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteDesign(e, design.id!)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500 rounded transition-all ml-2"
                    title="Delete design"
                  >
                    <Trash2 size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

