import { useState } from 'react';
import { database, ID } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_CONTRACTOR } from '@env';
import { duration } from 'moment';

const useCreateContractor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createContractor = async (contractorData) => {
    const { userId, title, description, duration, paymentType, amount, installments } = contractorData;

    const escrowLink = `public.cx/${ID.unique()}`;
    try {
      setLoading(true);
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_CONTRACTOR,
        ID.unique(),
        {
          user_id: userId,
          title,
          description,
          duration,
          payment_type: paymentType,
          amount: paymentType === 'One time payment' ? amount : null,
          installments: paymentType === 'Installmental payment' ? JSON.stringify(installments) : null,
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

  return { createContractor, loading, error };
};

export default useCreateContractor;
