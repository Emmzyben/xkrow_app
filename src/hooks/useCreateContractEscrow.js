import { useState } from 'react';
import { database, ID, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PROFILE, COLLECTION_ID_ESCROW } from '@env';

const useCreateContractorEscrow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateEscrowFee = (amount) => {
    if (amount <= 49999) {
      return 500;
    } else if (amount <= 124999) {
      return 750;
    } else if (amount <= 199999) {
      return 1000;
    } else {
      return amount * 0.0125;
    }
  };

  const createEscrow = async (escrowData) => {
    const { amount: amountStr, contractorId, buyerId, escrowLink } = escrowData;

    try {
      setLoading(true);
      setError(null);

      // Convert amount to a number
      const amount = Number(amountStr);
      if (isNaN(amount)) {
        throw new Error('Invalid amount');
      }

      // Calculate the escrow fee
      const escrowFee = calculateEscrowFee(amount);
      const contractorEscrowFee = escrowFee / 2;
      const buyerEscrowFee = escrowFee / 2;

      // Fetch contractor profile
      console.log(`Fetching profile for contractorId: ${contractorId}`);
      const contractorProfileResponse = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', contractorId)]
      );

      if (contractorProfileResponse.total === 0) {
        throw new Error('Contractor profile not found');
      }

      const contractorProfileDoc = contractorProfileResponse.documents[0];
      console.log(`Contractor profile found: ${JSON.stringify(contractorProfileDoc)}`);

      const contractorCurrentBalance = contractorProfileDoc.balance;

      // Fetch buyer profile
      console.log(`Fetching profile for buyerId: ${buyerId}`);
      const buyerProfileResponse = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', buyerId)]
      );

      if (buyerProfileResponse.total === 0) {
        throw new Error('Buyer profile not found');
      }

      const buyerProfileDoc = buyerProfileResponse.documents[0];
      console.log(`Buyer profile found: ${JSON.stringify(buyerProfileDoc)}`);

      const buyerCurrentBalance = buyerProfileDoc.balance;

      // Check if the contractor has sufficient balance for the amount and their part of the escrow fee
      if (contractorCurrentBalance < amount + contractorEscrowFee) {
        throw new Error('Insufficient balance in contractor account');
      }

      // Check if the buyer has sufficient balance for their part of the escrow fee
      if (buyerCurrentBalance < buyerEscrowFee) {
        throw new Error('Insufficient balance in buyer account');
      }

      // Deduct the escrow fee from the contractor's and buyer's balances
      const newContractorBalance = contractorCurrentBalance - (amount + contractorEscrowFee);
      const newBuyerBalance = buyerCurrentBalance - buyerEscrowFee;

      // Update the contractor's profile with the new balance
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        contractorProfileDoc.$id,
        { balance: newContractorBalance }
      );

      // Update the buyer's profile with the new balance
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        buyerProfileDoc.$id,
        { balance: newBuyerBalance }
      );

      // Create new escrow document
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        ID.unique(),
        {
          amount: amount.toString(), 
          vendor_id: contractorId,
          buyer_id: buyerId,
          escrow_link: escrowLink,
          status: "Pending",
          seller: "contractor",
          created_at: new Date().toISOString(),
        }
      );

      setLoading(false);
    } catch (error) {
      console.error('Error creating escrow:', error);
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { createEscrow, loading, error };
};

export default useCreateContractorEscrow;
