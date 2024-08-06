import { useState } from 'react';
import { database, ID } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_VENDOR } from '@env';

const useCreateVendor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createVendor = async (vendorData) => {
    const { userId, product_name, product_cost, description } = vendorData;

    const escrowLink = `public.cx/${ID.unique()}`; 
    try {
      setLoading(true);
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_VENDOR,
        ID.unique(),
        {
          user_id: userId,
          product_name,
          product_cost,
          description,
          escrow_url: escrowLink,
          created_at: new Date().toISOString(),
        }
      );
      setLoading(false);
      return escrowLink; 
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { createVendor, loading, error };
};

export default useCreateVendor;
