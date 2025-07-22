import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">მანეკი აუქციონი</h1>
        <p className="text-xl text-muted-foreground">Georgian Auction Platform</p>
        <Button 
          onClick={() => navigate('/auction/383')}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          View Samsung Galaxy S25 Ultra Auction
        </Button>
      </div>
    </div>
  );
};

export default Index;
