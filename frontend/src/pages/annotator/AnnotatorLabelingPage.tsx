import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ArrowLeft, SkipForward, Check, HelpCircle, MessageSquare, Info, Keyboard } from 'lucide-react';

// This is a mock component for the data viewer (e.g., image, text)
const DataViewer = () => {
  return (
    <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
      <img 
        src="https://via.placeholder.com/800x600.png/000000?text=Data+to+be+labeled" 
        alt="Data for labeling" 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

const AnnotatorLabelingPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const labels = ['Car', 'Pedestrian', 'Traffic Light', 'Bicycle'];

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/annotator/task/${taskId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold text-lg">Task: Labeling Batch 1</h1>
            <p className="text-sm text-gray-500">Item 46 of 100</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm"><Info className="h-4 w-4 mr-2"/>Guidelines</Button>
          <Button variant="ghost" size="sm"><Keyboard className="h-4 w-4 mr-2"/>Shortcuts</Button>
          <Button variant="ghost" size="sm"><MessageSquare className="h-4 w-4 mr-2"/>Report Issue</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Labeling Tools Sidebar */}
        <aside className="w-64 bg-white border-r p-4 space-y-4 overflow-y-auto">
          <h2 className="text-lg font-semibold">Labels</h2>
          <div className="flex flex-col gap-2">
            {labels.map(label => (
              <Button 
                key={label}
                variant={selectedLabel === label ? 'primary' : 'outline'}
                onClick={() => setSelectedLabel(label)}
                className="justify-start"
              >
                {label}
              </Button>
            ))}
          </div>
          <hr/>
          <h2 className="text-lg font-semibold">Tools</h2>
          {/* Placeholder for tools like Bounding Box, Polygon etc. */}
          <Button variant="primary" className="w-full">Bounding Box</Button>
        </aside>

        {/* Data Viewer */}
        <div className="flex-1 p-4">
          <DataViewer />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t p-3 flex justify-end gap-3">
        <Button variant="outline" size="lg">
          <SkipForward className="h-5 w-5 mr-2"/>
          Skip
        </Button>
        <Button variant="primary" size="lg">
          <Check className="h-5 w-5 mr-2"/>
          Submit
        </Button>
      </footer>
    </div>
  );
};

export default AnnotatorLabelingPage;
