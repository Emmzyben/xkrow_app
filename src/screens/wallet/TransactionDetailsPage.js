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
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>₦{associatedDocument.amount}</Text>
              {/* <Text style={styles.label}>Installments:</Text>
              {renderInstallments(associatedDocument.installments)} */}
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Product Name:</Text>
              <Text style={styles.value}>{associatedDocument.product_name}</Text>
              <Text style={styles.label}>Product Cost:</Text>
              <Text style={styles.value}>₦{associatedDocument.product_cost}</Text>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{associatedDocument.description}</Text>
            </View>
          )}
        </View>
      )}
      {showCompleteWorkButton && (
        <View style={styles.lastDown1}>
          <TouchableOpacity style={styles.button} onPress={handleCompleteWork} disabled={isLoadingCompleteWork}>
            {isLoadingCompleteWork ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>I have completed the work</Text>}
          </TouchableOpacity>
        </View>
      )}
      {showConfirmPaymentButton && (
        <View style={styles.lastDown1}>
          <TouchableOpacity style={styles.button} onPress={handleConfirmPayment} disabled={isLoadingConfirmPayment}>
            {isLoadingConfirmPayment ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm Payment</Text>}
          </TouchableOpacity>
        </View>
      )}
      {showReceivedGoodsButton && (
        <View style={styles.lastDown1}>
          <TouchableOpacity style={styles.button} onPress={handleReceivedGoods} disabled={isLoadingReceivedGoods}>
            {isLoadingReceivedGoods ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>I have received items</Text>}
          </TouchableOpacity>
        </View>
      )}
      {showOpenConflictTicketButton && (
        <View style={styles.lastDown1}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Open conflict ticket</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftButton: {
    marginRight: 10,
  },
  rightButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'rgba(98, 36, 143, 1)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  lastDown1: {
    marginBottom: 20,
  },
});

export default TransactionDetailsPage;
