-- Create auctions table
CREATE TABLE public.auctions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  starting_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  current_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bids table
CREATE TABLE public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Create policies for auctions (everyone can view, admins can manage)
CREATE POLICY "Anyone can view auctions" 
ON public.auctions 
FOR SELECT 
USING (true);

-- Create policies for bids (everyone can view, authenticated users can create their own)
CREATE POLICY "Anyone can view bids" 
ON public.bids 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create bids" 
ON public.bids 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on auctions
CREATE TRIGGER update_auctions_updated_at
BEFORE UPDATE ON public.auctions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_bids_auction_id ON public.bids(auction_id);
CREATE INDEX idx_bids_user_id ON public.bids(user_id);
CREATE INDEX idx_bids_created_at ON public.bids(created_at DESC);
CREATE INDEX idx_auctions_status ON public.auctions(status);
CREATE INDEX idx_auctions_end_time ON public.auctions(end_time);

-- Enable realtime for live updates
ALTER TABLE public.auctions REPLICA IDENTITY FULL;
ALTER TABLE public.bids REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;

-- Insert sample auction data
INSERT INTO public.auctions (id, title, description, starting_price, current_price, image_url, end_time, status) 
VALUES (
  '383e4567-e89b-12d3-a456-426614174000',
  'Samsung Galaxy S25 Ultra',
  'Latest flagship smartphone with cutting-edge features, 1TB storage, titanium frame',
  500.00,
  899.99,
  '/src/assets/samsung-galaxy-s25-ultra.jpg',
  NOW() + INTERVAL '6 hours',
  'active'
);

-- Function to update auction current price when new bid is made
CREATE OR REPLACE FUNCTION public.update_auction_price()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.auctions 
  SET current_price = NEW.amount, updated_at = now()
  WHERE id = NEW.auction_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to automatically update auction price
CREATE TRIGGER update_auction_price_on_bid
  AFTER INSERT ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION public.update_auction_price();