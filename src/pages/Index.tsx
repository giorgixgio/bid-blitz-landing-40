import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">მანეკი აუქციონი</h1>
        <p className="text-xl text-muted-foreground">Georgian Auction Platform</p>
        
        {/* Auth Section */}
        {!user ? (
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              variant="outline"
              className="mr-4"
            >
              Sign In / Sign Up
            </Button>
            <p className="text-sm text-muted-foreground">
              Join to participate in auctions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              Welcome back!
            </p>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        )}
        
        <Button 
          onClick={() => navigate('/auction/383e4567-e89b-12d3-a456-426614174000')}
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
