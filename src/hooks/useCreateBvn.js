import { useState } from 'react';
import { database, ID } from '../backend/appwite'; 
import { DATABASE_ID, COLLECTION_ID_BVN } from '@env';

const useCreateBvn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBvn = async (BvnData) => {
    const {
      userId,
      bvn,
      gender,
      dob,
    } = BvnData;

    try {
      setLoading(true);
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_BVN,
        ID.unique(),
        {
          user_id: userId,
          bvn: bvn,
          gender: gender,
          dob: dob,
          created_at: new Date().toISOString(),
        }
      );
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { createBvn, loading, error };
};

export default useCreateBvn;
