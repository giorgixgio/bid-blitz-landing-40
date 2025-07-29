import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  totalWinnings: number;
  auctionsWon: number;
  totalBids: number;
}

export interface Bid {
  id: string;
  userId: string;
  username: string;
  amount: number;
  timestamp: number;
  auctionId: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  image: string;
  startTime: number;
  endTime: number;
  timeLeft: number;
  bidIncrement: number;
  currentBid: number;
  prizePool: number;
  bids: Bid[];
  isActive: boolean;
  isEnded: boolean;
  winner?: User;
  finalResults?: AuctionResults;
}

export interface AuctionResults {
  winner: { user: User; prize: number; winnerBonus: number };
  second?: { user: User; prize: number };
  third?: { user: User; prize: number };
  randomRewards: { user: User; prize: number }[];
  jackpotTriggered: boolean;
  jackpotWinner?: User;
  jackpotAmount?: number;
}

interface GameState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Game Data
  auctions: Auction[];
  globalJackpot: number;
  leaderboard: User[];
  auctionHistory: Auction[];
  
  // Actions
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  
  // Auction Actions
  placeBid: (auctionId: string, amount: number) => boolean;
  updateAuctionTimer: (auctionId: string) => void;
  endAuction: (auctionId: string) => void;
  createAuction: (title: string, description: string, bidIncrement: number) => void;
  
  // Admin
  addFundsToUser: (userId: string, amount: number) => void;
  triggerJackpot: () => void;
}

// Mock users data
const mockUsers: User[] = [
  { id: '1', username: 'CryptoKing', email: 'king@crypto.com', balance: 50.0, totalWinnings: 125.5, auctionsWon: 8, totalBids: 45 },
  { id: '2', username: 'BitMaster', email: 'master@bit.com', balance: 75.2, totalWinnings: 89.3, auctionsWon: 5, totalBids: 32 },
  { id: '3', username: 'TokenTrader', email: 'trader@token.com', balance: 32.1, totalWinnings: 67.8, auctionsWon: 3, totalBids: 28 },
  { id: '4', username: 'NFTCollector', email: 'collector@nft.com', balance: 98.7, totalWinnings: 234.1, auctionsWon: 12, totalBids: 67 },
];

// Calculate prize distribution
const calculatePrizeDistribution = (auction: Auction): AuctionResults => {
  const sortedBids = [...auction.bids].sort((a, b) => b.timestamp - a.timestamp);
  const uniqueBidders = [...new Set(sortedBids.map(bid => bid.userId))];
  
  const winner = mockUsers.find(u => u.id === uniqueBidders[0]);
  const second = mockUsers.find(u => u.id === uniqueBidders[1]);
  const third = mockUsers.find(u => u.id === uniqueBidders[2]);
  
  // Winner bonus calculation (50% base + 2% per bid, max 80%)
  const winnerBids = auction.bids.filter(bid => bid.userId === winner?.id).length;
  const winnerBonus = Math.min(50 + (winnerBids * 2), 80);
  
  const results: AuctionResults = {
    winner: { 
      user: winner!, 
      prize: auction.prizePool * (winnerBonus / 100),
      winnerBonus 
    },
    randomRewards: [],
    jackpotTriggered: Math.random() < 0.1, // 10% chance
  };
  
  if (second) {
    results.second = { user: second, prize: auction.prizePool * 0.25 };
  }
  
  if (third) {
    results.third = { user: third, prize: auction.prizePool * 0.1 };
  }
  
  // Random rewards for other bidders
  const otherBidders = uniqueBidders.slice(3).slice(0, 3);
  results.randomRewards = otherBidders.map(id => ({
    user: mockUsers.find(u => u.id === id)!,
    prize: auction.prizePool * (Math.random() * 0.05 + 0.01) // 1-6%
  }));
  
  return results;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      globalJackpot: 15.7,
      leaderboard: mockUsers.sort((a, b) => b.totalWinnings - a.totalWinnings),
      auctionHistory: [],
      
      auctions: [
        {
          id: '383',
          title: 'Samsung Galaxy S25 Ultra',
          description: 'Latest flagship smartphone with crypto mining capabilities',
          image: '/src/assets/samsung-galaxy-s25-ultra.jpg',
          startTime: Date.now() - 60000,
          endTime: Date.now() + 120000,
          timeLeft: 120,
          bidIncrement: 0.01,
          currentBid: 2.45,
          prizePool: 12.8,
          bids: [
            { id: '1', userId: '1', username: 'CryptoKing', amount: 2.45, timestamp: Date.now() - 5000, auctionId: '383' },
            { id: '2', userId: '2', username: 'BitMaster', amount: 2.44, timestamp: Date.now() - 15000, auctionId: '383' },
          ],
          isActive: true,
          isEnded: false,
        },
        {
          id: '384',
          title: 'Bitcoin Mining Hardware',
          description: 'Professional ASIC miner for crypto enthusiasts',
          image: '/src/assets/bitcoin-3d-golden.png',
          startTime: Date.now() - 30000,
          endTime: Date.now() + 180000,
          timeLeft: 180,
          bidIncrement: 0.02,
          currentBid: 1.8,
          prizePool: 8.5,
          bids: [
            { id: '3', userId: '3', username: 'TokenTrader', amount: 1.8, timestamp: Date.now() - 8000, auctionId: '384' },
          ],
          isActive: true,
          isEnded: false,
        }
      ],
      
      // Auth actions
      login: (email: string, password: string) => {
        // Mock login - just check if user exists
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      register: (username: string, email: string, password: string) => {
        // Mock registration
        const newUser: User = {
          id: Date.now().toString(),
          username,
          email,
          balance: 10.0, // Starting balance
          totalWinnings: 0,
          auctionsWon: 0,
          totalBids: 0,
        };
        
        mockUsers.push(newUser);
        set({ currentUser: newUser, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      // Auction actions
      placeBid: (auctionId: string, amount: number) => {
        const state = get();
        if (!state.currentUser) return false;
        
        const auction = state.auctions.find(a => a.id === auctionId);
        if (!auction || !auction.isActive || amount < auction.currentBid + auction.bidIncrement) {
          return false;
        }
        
        if (state.currentUser.balance < amount) return false;
        
        const newBid: Bid = {
          id: Date.now().toString(),
          userId: state.currentUser.id,
          username: state.currentUser.username,
          amount,
          timestamp: Date.now(),
          auctionId,
        };
        
        set(state => ({
          auctions: state.auctions.map(a => 
            a.id === auctionId 
              ? { 
                  ...a, 
                  currentBid: amount,
                  prizePool: a.prizePool + a.bidIncrement,
                  timeLeft: Math.max(a.timeLeft, 30), // Extend by 30 seconds or keep current
                  bids: [...a.bids, newBid],
                }
              : a
          ),
          currentUser: state.currentUser ? {
            ...state.currentUser,
            balance: state.currentUser.balance - amount,
            totalBids: state.currentUser.totalBids + 1,
          } : null,
          globalJackpot: state.globalJackpot + (amount * 0.02), // 2% goes to jackpot
        }));
        
        return true;
      },
      
      updateAuctionTimer: (auctionId: string) => {
        set(state => ({
          auctions: state.auctions.map(auction => {
            if (auction.id === auctionId && auction.isActive) {
              const newTimeLeft = Math.max(0, auction.timeLeft - 1);
              if (newTimeLeft === 0) {
                // Auto-end auction
                get().endAuction(auctionId);
              }
              return { ...auction, timeLeft: newTimeLeft };
            }
            return auction;
          })
        }));
      },
      
      endAuction: (auctionId: string) => {
        const state = get();
        const auction = state.auctions.find(a => a.id === auctionId);
        if (!auction) return;
        
        const results = calculatePrizeDistribution(auction);
        
        // Update winners' balances and stats
        const updatedUsers = [...mockUsers];
        
        // Winner
        const winnerIndex = updatedUsers.findIndex(u => u.id === results.winner.user.id);
        if (winnerIndex !== -1) {
          updatedUsers[winnerIndex] = {
            ...updatedUsers[winnerIndex],
            balance: updatedUsers[winnerIndex].balance + results.winner.prize,
            totalWinnings: updatedUsers[winnerIndex].totalWinnings + results.winner.prize,
            auctionsWon: updatedUsers[winnerIndex].auctionsWon + 1,
          };
        }
        
        // Other winners
        [results.second, results.third, ...results.randomRewards].forEach(result => {
          if (result) {
            const index = updatedUsers.findIndex(u => u.id === result.user.id);
            if (index !== -1) {
              updatedUsers[index] = {
                ...updatedUsers[index],
                balance: updatedUsers[index].balance + result.prize,
                totalWinnings: updatedUsers[index].totalWinnings + result.prize,
              };
            }
          }
        });
        
        set(state => ({
          auctions: state.auctions.map(a => 
            a.id === auctionId 
              ? { ...a, isActive: false, isEnded: true, finalResults: results }
              : a
          ),
          auctionHistory: [
            ...state.auctionHistory,
            { ...auction, isActive: false, isEnded: true, finalResults: results }
          ],
          leaderboard: updatedUsers.sort((a, b) => b.totalWinnings - a.totalWinnings),
        }));
      },
      
      createAuction: (title: string, description: string, bidIncrement: number) => {
        const newAuction: Auction = {
          id: Date.now().toString(),
          title,
          description,
          image: '/src/assets/bitcoin-3d.jpg',
          startTime: Date.now(),
          endTime: Date.now() + 300000, // 5 minutes
          timeLeft: 300,
          bidIncrement,
          currentBid: bidIncrement,
          prizePool: 0,
          bids: [],
          isActive: true,
          isEnded: false,
        };
        
        set(state => ({
          auctions: [...state.auctions, newAuction]
        }));
      },
      
      addFundsToUser: (userId: string, amount: number) => {
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          mockUsers[userIndex].balance += amount;
          
          set(state => ({
            currentUser: state.currentUser?.id === userId 
              ? { ...state.currentUser, balance: state.currentUser.balance + amount }
              : state.currentUser
          }));
        }
      },
      
      triggerJackpot: () => {
        const state = get();
        if (state.currentUser) {
          set(state => ({
            currentUser: state.currentUser ? {
              ...state.currentUser,
              balance: state.currentUser.balance + state.globalJackpot,
              totalWinnings: state.currentUser.totalWinnings + state.globalJackpot,
            } : null,
            globalJackpot: 0,
          }));
        }
      },
    }),
    {
      name: 'crypto-auction-game',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
