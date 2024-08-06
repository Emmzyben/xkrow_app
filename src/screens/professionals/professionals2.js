import React from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import useCreateContractorEscrow from '../../hooks/useCreateContractEscrow';
import { useUser } from '../../backend/user';

const Professionals2 = ({ navigation, route }) => {
  const { contractorData } = route.params;
  const contextUser = useUser();
  const { createEscrow, loading, error } = useCreateContractorEscrow();

  if (!contractorData) {
    return (
      <View style={localStyles.container}>
        <Text style={localStyles.noDataText}>No contractor data available.</Text>
      </View>
    );
  }

  const handleAcceptTransaction = async () => {
    try {
      const totalAmount = contractorData.payment_type === 'One time payment'
        ? contractorData.amount.toString()
        : contractorData.installments.reduce((sum, installment) => sum + parseFloat(installment.amount), 0).toString();

      const escrowData = {
        amount: totalAmount,
        contractorId: contractorData.user_id,
        buyerId: contextUser.user.id,
        escrowLink: contractorData.escrow_url,
      };
      await createEscrow(escrowData);
      Alert.alert('Success', 'Transaction accepted successfully');
      navigation.navigate('Details2', { contractorData, totalAmount });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Buyer1')} style={localStyles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.title}>New Xkrow transaction</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbox')} style={localStyles.chatButton}>
          <FontAwesomeIcon icon={faCommentDots} size={17} />
        </TouchableOpacity>
      </View>

      <View style={localStyles.infoContainer}>
        <Text style={styles.text4}>Business Transaction</Text>
        <Text style={styles.text5}>Contract Title</Text>
        <Text style={styles.text7}>{contractorData.title}</Text>
        <Text style={styles.text5}>Description</Text>
        <Text style={styles.text7}>{contractorData.description}</Text>
        <Text style={styles.text5}>Duration</Text>
        <Text style={styles.text7}>{contractorData.duration}</Text>
      
      </View>

      {contractorData.payment_type === 'One time payment' ? (
        <View style={localStyles.amountContainer}>
          <Text style={styles.text5}>Amount</Text>
          <Text style={styles.text7}>₦{contractorData.amount}</Text>
        </View>
      ) : (
        <View style={localStyles.installmentsContainer}>
          <Text style={styles.text5}>Installments</Text>
          {contractorData.installments && contractorData.installments.map((installment, index) => (
            <View key={index} style={localStyles.installment}>
              <Text style={styles.text7}>Amount: ₦{installment.amount}</Text>
              <Text style={styles.text7}>Date: {installment.date}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.lastDown1}>
        <TouchableOpacity style={styles.btn} onPress={handleAcceptTransaction} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Accept Transaction</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn3} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 30,
    borderColor: 'rgba(102, 112, 133, 1)',
    borderWidth: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 30,left:15,
    zIndex: 1000,
  },
  chatButton: {
    position: 'absolute',
    top: 30,right:15,
    zIndex: 1000,
    right: '5%',
  },
  title: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
  infoContainer: {
    padding: 20,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  amountContainer: {
    padding: 20,
  },
  installmentsContainer: {
    padding: 20,
  },
  installment: {
    marginBottom: 10,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
});

export default Professionals2;
