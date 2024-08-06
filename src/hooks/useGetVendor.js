import { useState } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_ESCROW, COLLECTION_ID_VENDOR } from '@env';

const useGetVendor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getVendor = async (escrowLink) => {
    try {
      setLoading(true);

      // Check the escrow collection first
      const escrowResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_ESCROW, [
        Query.equal('escrow_link', escrowLink)
      ]);

      // If the escrow link exists in the escrow collection, throw an error
      if (escrowResponse.documents.length > 0) {
        throw new Error('Escrow link has been used for a transaction');
      }

      // If the escrow link does not exist, proceed to check the vendor collection
      const vendorResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_VENDOR, [
        Query.equal('escrow_url', escrowLink)
      ]);

      setLoading(false);
      
      if (vendorResponse.documents.length > 0) {
        return vendorResponse.documents[0];
      } else {
        throw new Error('No vendor found with the provided escrow link');
      }
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { getVendor, loading, error };
};

export default useGetVendor;
