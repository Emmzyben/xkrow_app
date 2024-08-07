import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useGetInfo from '../../hooks/useGetinfo';
import { useUser } from '../../backend/user';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import useCreateNotify from '../../hooks/useCreatenotify';
import useReleasePayment from '../../hooks/useReleasePayment';
import ReleaseSuccess from '../../components/releaseSuccess';
import Failure2 from '../../components/failure2';
import ReleaseSuccessCopy from '../../components/releaseSuccessCopy';
import Failure2Copy from '../../components/failure2Copy';
import useHandleConfirm from '../../hooks/useHandleConfirm';

const TransactionDetailsPage = ({ navigation }) => {
  const contextUser = useUser();
  const route = useRoute();
  const { escrowLink } = route.params;
  const { getInfo, loading, error, escrowDocument, associatedDocument } = useGetInfo();
  const { CreateNotify } = useCreateNotify();
  const { releasePayment } = useReleasePayment();
  const { HandleConfirm } = useHandleConfirm();
  const [status, setStatus] = useState(null);
  const [status1, setStatus1] = useState(null);
  const [isLoadingCompleteWork, setIsLoadingCompleteWork] = useState(false);
  const [isLoadingConfirmPayment, setIsLoadingConfirmPayment] = useState(false);
  const [isLoadingReceivedGoods, setIsLoadingReceivedGoods] = useState(false);

  useEffect(() => {
    getInfo({ escrowUrl: escrowLink });
  }, [escrowLink]);

  const renderInstallments = (installmentsString) => {
    try {
      const installments = JSON.parse(installmentsString);
      return installments.map((installment, index) => (
        <View key={index} style={styles.installment}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>₦ {installment.amount}</Text>
          <Text style={styles.label}>Date:</Text>
          {/* <Text style={styles.value}>{installment.date}</Text> */}
        </View>
      ));
    } catch (error) {
      return <Text style={styles.error}>Invalid installment data</Text>;
    }
  };

  const handleCompleteWork = async () => {
    setIsLoadingCompleteWork(true);
    try {
      await CreateNotify({
        escrowUrl: escrowDocument.escrow_link,
        vendor_id: escrowDocument.vendor_id,
      });
      setStatus1('success');
    } catch (err) {
      setStatus1('error');
    } finally {
      setIsLoadingCompleteWork(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsLoadingConfirmPayment(true);
    try {
      setStatus('loading');
      await HandleConfirm({
        vendorId: escrowDocument.vendor_id,
        escrowUrl: escrowDocument.escrow_link,
        buyerId: escrowDocument.buyer_id,
      });
      setStatus1('success');
    } catch (error) {
      console.error('Error:', error);
      setStatus1('error');
    } finally {
      setIsLoadingConfirmPayment(false);
    }
  };

  const handleReceivedGoods = async () => {
    setIsLoadingReceivedGoods(true);
    try {
      await releasePayment({
        vendorId: escrowDocument.vendor_id,
        buyerId: contextUser.user.id,
        amount: associatedDocument.product_cost,
        escrowUrl: escrowDocument.escrow_link,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    } finally {
      setIsLoadingReceivedGoods(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  console.log('Escrow Document:', escrowDocument);
  console.log('Context User ID:', contextUser.user.id);
  console.log('Escrow Document Seller:', escrowDocument ? escrowDocument.seller : 'undefined');
  console.log('Escrow Document Status:', escrowDocument ? escrowDocument.status : 'undefined');

  const showCompleteWorkButton =
    escrowDocument &&
    escrowDocument.seller === 'contractor' &&
    contextUser.user.id === escrowDocument.buyer_id &&
    escrowDocument.status === 'Pending';

  const showConfirmPaymentButton =
    escrowDocument &&
    contextUser.user.id === escrowDocument.vendor_id &&
    escrowDocument.status === 'awaiting confirmation';

  const showReceivedGoodsButton =
    escrowDocument &&
    escrowDocument.seller === 'vendor' &&
    contextUser.user.id === escrowDocument.buyer_id &&
    escrowDocument.status === 'Pending';

  const showOpenConflictTicketButton =
    escrowDocument &&
    (escrowDocument.status === 'Pending' || escrowDocument.status === 'awaiting confirmation');

  console.log('Show Complete Work Button:', showCompleteWorkButton);
  console.log('Show Confirm Payment Button:', showConfirmPaymentButton);
  console.log('Show Received Goods Button:', showReceivedGoodsButton);
  console.log('Show Open Conflict Ticket Button:', showOpenConflictTicketButton);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FundTransactions')}
          style={styles.leftButton}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction Details</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chatbox')}
          style={styles.rightButton}
        >
          <FontAwesomeIcon icon={faCommentDots} size={17} />
        </TouchableOpacity>
      </View>
      {escrowDocument && (
        <View style={styles.section}>
          <Text style={styles.title}>Transaction status</Text>
          <Text style={styles.value}>{escrowDocument.status}</Text>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{escrowDocument.$id}</Text>
        </View>
      )}
      {associatedDocument && (
        <View style={styles.section}>
          <Text style={styles.title}>Transaction Information</Text>
          {escrowDocument.seller === 'contractor' ? (
            <View>
              <Text style={styles.label}>Title:</Text>
              <Text style={styles.value}>{associatedDocument.title}</Text>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{associatedDocument.description}</Text>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>{associatedDocument.duration}</Text>
              <Text style={styles.label}>Payment Type:</Text>
              <Text style={styles.value}>{associatedDocument.payment_type}</Text>
              {/* <Text style={styles.label}>Installments:</Text>
              {renderInstallments(associatedDocument.installments)} */}
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Product Name:</Text>
              <Text style={styles.value}>{associatedDocument.product_name}</Text>
              <Text style={styles.label}>Product Cost:</Text>
              <Text style={styles.value}>₦ {associatedDocument.product_cost}</Text>
            </View>
          )}
        </View>
      )}
      {showCompleteWorkButton && (
        <TouchableOpacity
          style={[styles.button, isLoadingCompleteWork && styles.buttonLoading]}
          onPress={handleCompleteWork}
          disabled={isLoadingCompleteWork}
        >
          {isLoadingCompleteWork ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Complete Work</Text>
          )}
        </TouchableOpacity>
      )}
      {showConfirmPaymentButton && (
        <TouchableOpacity
          style={[styles.button, isLoadingConfirmPayment && styles.buttonLoading]}
          onPress={handleConfirmPayment}
          disabled={isLoadingConfirmPayment}
        >
          {isLoadingConfirmPayment ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Confirm Payment</Text>
          )}
        </TouchableOpacity>
      )}
      {showReceivedGoodsButton && (
        <TouchableOpacity
          style={[styles.button, isLoadingReceivedGoods && styles.buttonLoading]}
          onPress={handleReceivedGoods}
          disabled={isLoadingReceivedGoods}
        >
          {isLoadingReceivedGoods ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Received Goods</Text>
          )}
        </TouchableOpacity>
      )}
      {showOpenConflictTicketButton && (
        <TouchableOpacity
          style={[styles.button, styles.conflictButton]}
          onPress={() => navigation.navigate('ConflictTicket', { escrowDocument })}
        >
          <Text style={styles.buttonText}>Open Conflict Ticket</Text>
        </TouchableOpacity>
      )}
      {status === 'success' && <ReleaseSuccess />}
      {status === 'error' && <Failure2 />}
      {status1 === 'success' && <ReleaseSuccessCopy />}
      {status1 === 'error' && <Failure2Copy />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  leftButton: {
    padding: 8,
  },
  rightButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  conflictButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonLoading: {
    opacity: 0.7,
  },
  installment: {
    marginBottom: 8,
  },
  error: {
    color: 'red',
  },
});

export default TransactionDetailsPage;
