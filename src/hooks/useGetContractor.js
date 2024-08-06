import { useState } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_CONTRACTOR, COLLECTION_ID_ESCROW } from '@env';

const useGetContractor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getContractor = async (escrowLink) => {
    try {
      setLoading(true);

      // Check the escrow collection first
      const escrowResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_ESCROW, [
        Query.equal('escrow_link', escrowLink)
      ]);

      if (escrowResponse.documents.length > 0) {
        setLoading(false);
        throw new Error('This escrow link has already been used for a transaction');
      }

      // If escrow link is not used, proceed to check the contractor collection
      const contractorResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_CONTRACTOR, [
        Query.equal('escrow_url', escrowLink)
      ]);

      setLoading(false);

      if (contractorResponse.documents.length > 0) {
        return contractorResponse.documents[0];
      } else {
        throw new Error('No contractor found with the provided escrow link');
      }
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { getContractor, loading, error };
};

export default useGetContractor;
