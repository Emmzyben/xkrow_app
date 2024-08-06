import { useState, useEffect } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PROFILE } from '@env';
import { useUser } from '../backend/user';

const useGetProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', user.id)]
      );

      if (profileQuery.total > 0) {
        setProfile(profileQuery.documents[0]);
      } else {
        setProfile(null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error);
      setLoading(false);
    }
  };

  return { profile, loading, error, fetchProfile };
};

export default useGetProfile;
