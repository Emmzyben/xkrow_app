import { useState } from 'react';
import { database, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_ESCROW, COLLECTION_ID_VENDOR, COLLECTION_ID_CONTRACTOR } from '@env';

const useGetInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [escrowDocument, setEscrowDocument] = useState(null);
  const [associatedDocument, setAssociatedDocument] = useState(null);

  const getInfo = async ({ escrowUrl }) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the escrow document
      const escrowQuery = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        [Query.equal('escrow_link', escrowUrl)]
      );

      if (escrowQuery.total === 0) {
        throw new Error('Escrow document not found');
      }

      const escrowDoc = escrowQuery.documents[0];
      setEscrowDocument(escrowDoc);

      // Fetch the associated document based on the seller attribute
      let associatedDoc;
      if (escrowDoc.seller === 'vendor') {
        const vendorQuery = await database.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_VENDOR,
          [Query.equal('escrow_url', escrowUrl)]
        );
        if (vendorQuery.total === 0) {
          throw new Error('Vendor document not found');
        }
        associatedDoc = vendorQuery.documents[0];
      } else if (escrowDoc.seller === 'contractor') {
        const contractorQuery = await database.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_CONTRACTOR,
          [Query.equal('escrow_url', escrowUrl)]
        );
        if (contractorQuery.total === 0) {
          throw new Error('Contractor document not found');
        }
        associatedDoc = contractorQuery.documents[0];
      }
      setAssociatedDocument(associatedDoc);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError(error);
      setLoading(false);
    }
  };

  return { getInfo, loading, error, escrowDocument, associatedDocument };
};

export default useGetInfo;
