import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/hooks/useGameStore';
import { toast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const { login, register } = useGameStore();

  const handleLogin = () => {
    if (login(loginData.email, loginData.password)) {
      toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
      onOpenChange(false);
      setLoginData({ email: '', password: '' });
    } else {
      toast({ title: 'Login failed', description: 'Invalid credentials', variant: 'destructive' });
    }
  };

  const handleRegister = () => {
    if (register(registerData.username, registerData.email, registerData.password)) {
      toast({ 
        title: 'Welcome to the game!', 
        description: 'Account created with 10.0 BTC starting balance!' 
      });
      onOpenChange(false);
      setRegisterData({ username: '', email: '', password: '' });
    } else {
      toast({ title: 'Registration failed', description: 'Please try again', variant: 'destructive' });
    }
  };

  const handleDemoLogin = () => {
    if (login('king@crypto.com', 'demo')) {
      toast({ title: 'Demo Mode', description: 'Logged in as CryptoKing!' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join the Auction Game</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <Button variant="outline" onClick={handleDemoLogin} className="w-full">
              Demo Login (CryptoKing)
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-username">Username</Label>
              <Input
                id="register-username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                placeholder="CryptoTrader123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <Button onClick={handleRegister} className="w-full">
              Create Account
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};