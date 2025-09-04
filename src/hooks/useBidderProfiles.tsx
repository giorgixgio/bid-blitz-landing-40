import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BidderProfile {
  user_id: string;
  username: string;
}

export const useBidderProfiles = (userIds: string[]) => {
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProfiles = async () => {
      if (userIds.length === 0) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, username')
          .in('user_id', userIds);

        if (error) throw error;

        const profileMap: Record<string, string> = {};
        data?.forEach((profile) => {
          profileMap[profile.user_id] = profile.username;
        });

        setProfiles(profileMap);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, [userIds]);

  const getUsernameById = (userId: string) => {
    return profiles[userId] || `User ${userId.slice(0, 8)}`;
  };

  return { getUsernameById };
};