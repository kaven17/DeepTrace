import { Shield, BookUser, MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActionPanel = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <p className="font-semibold text-lg hidden sm:block">Recommended Actions</p>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="secondary">
              <BookUser className="mr-2 h-4 w-4" />
              Verify Source
            </Button>
            <Button variant="secondary">
              <MessageSquareWarning className="mr-2 h-4 w-4" />
              Do Not Forward
            </Button>
            <Button variant="destructive">
              <Shield className="mr-2 h-4 w-4" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;
