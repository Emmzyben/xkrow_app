import { useState } from 'react';
import { database, ID, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_ESCROW, COLLECTION_ID_PROFILE } from '@env';
import useCreateNotification from './useCreateNotification';

const useCreateEscrow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createNotification = useCreateNotification();

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
    const { amount, vendorId, buyerId, escrowLink } = escrowData;

    try {
      setLoading(true);
      setError(null);

      // Ensure the amount is treated as a number for calculations
      const numericAmount = Number(amount);

      // Calculate the escrow fee
      const escrowFee = calculateEscrowFee(numericAmount);
      const buyerEscrowFee = escrowFee / 2;
      const vendorEscrowFee = escrowFee / 2;

      // Fetch the buyer's profile document to get the current balance
      const buyerProfile = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', buyerId)]
      );

      if (buyerProfile.total === 0) {
        throw new Error('Buyer profile not found');
      }

      const buyerProfileDoc = buyerProfile.documents[0];
      const buyerCurrentBalance = buyerProfileDoc.balance;

      // Debugging logs
      console.log(`Amount: ${numericAmount}`);
      console.log(`Buyer Escrow Fee: ${buyerEscrowFee}`);
      console.log(`Buyer Current Balance: ${buyerCurrentBalance}`);
      console.log(`Total Required Balance: ${numericAmount + buyerEscrowFee}`);

      // Fetch the vendor's profile document to get the current balance
      const vendorProfile = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        [Query.equal('user_id', vendorId)]
      );

      if (vendorProfile.total === 0) {
        throw new Error('Vendor profile not found');
      }

      const vendorProfileDoc = vendorProfile.documents[0];
      const vendorCurrentBalance = vendorProfileDoc.balance;

      // Check if the buyer has sufficient balance
      if (buyerCurrentBalance < (numericAmount + buyerEscrowFee)) {
        throw new Error('Insufficient balance for buyer');
      }

      // Check if the vendor has sufficient balance for the escrow fee
      if (vendorCurrentBalance < vendorEscrowFee) {
        throw new Error('Insufficient balance for vendor');
      }

      // Deduct the escrow fee from the buyer's and vendor's balances
      const newBuyerBalance = buyerCurrentBalance - (numericAmount + buyerEscrowFee);
      const newVendorBalance = vendorCurrentBalance - vendorEscrowFee;

      // Debugging log
      console.log(`New Buyer Balance: ${newBuyerBalance}`);
      console.log(`New Vendor Balance: ${newVendorBalance}`);

      // Update the buyer's profile with the new balance
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        buyerProfileDoc.$id,
        { balance: newBuyerBalance }
      );

      // Update the vendor's profile with the new balance
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_PROFILE,
        vendorProfileDoc.$id,
        { balance: newVendorBalance }
      );

      // Create the escrow document
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_ESCROW,
        ID.unique(),
        {
          amount: numericAmount.toString(),  // Convert amount back to string
          vendor_id: vendorId,
          buyer_id: buyerId,
          escrow_link: escrowLink,
          status: "Pending",
          seller: "vendor",
          created_at: new Date().toISOString(),
        }
      );

      // Send a notification to the vendor
      const message = `You have entered an escrow transaction with buyer ${buyerId}`;
      await createNotification(buyerId, vendorId, message);

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

export default useCreateEscrow;
