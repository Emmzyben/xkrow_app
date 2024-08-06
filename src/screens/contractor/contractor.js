import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert,ScrollView } from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Xkrow from '../../components/xkrow';
import { useUser } from '../../backend/user';
import useCreateContractor from '../../hooks/useCreateContractor';
import { Picker } from '@react-native-picker/picker';
import { duration } from 'moment/moment';
import { database, Query } from '../../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PROFILE, COLLECTION_ID_BVN, COLLECTION_ID_IDENTITY } from '@env';
import useGetProfile from '../../hooks/useGetProfile';
import KYC from '../../components/kyc';
import KYC2 from '../../components/kyc2';
import KYC3 from '../../components/kyc3';

const Contractor = ({ navigation }) => {
  const [paymentType, setPaymentType] = useState('One time payment');
  const [installments, setInstallments] = useState([{ amount: '', date: '' }]);
  const contextUser = useUser();
  const { createContractor, loading, error } = useCreateContractor();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  const [escrowLink, setEscrowLink] = useState(null);
  const { profile, loading: profileLoading, error: profileError, fetchProfile } = useGetProfile();
  const [showKYC1, setShowKYC1] = useState(false);
  const [showKYC2, setShowKYC2] = useState(false);
  const [showKYC3, setShowKYC3] = useState(false);
  const [checkingKYC, setCheckingKYC] = useState(false);
  const checkCollections = async () => {
    try {
      const userIdQuery = [Query.equal('user_id', contextUser.user.id)];

      const profileResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_PROFILE, userIdQuery);
      const bvnResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_BVN, userIdQuery);
      const identityResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_IDENTITY, userIdQuery);

      if (profileResponse.total === 0) {
        setShowKYC1(true);
      } else if (bvnResponse.total === 0 && identityResponse.total === 0) {
        setShowKYC2(true);
      } else if (bvnResponse.total > 0 && identityResponse.total === 0) {
        setShowKYC3(true);
      }
    } catch (error) {
      console.error('Error checking collections:', error);
    }
  };

  useEffect(() => {
    if (contextUser.user?.id) {
      fetchProfile();
      setCheckingKYC(true);
      const intervalId = setInterval(() => {
        checkCollections();
      }, 1000); 

      // Clear interval when KYC is completed or user logs out
      return () => {
        clearInterval(intervalId);
        setCheckingKYC(false);
      };
    }
  }, [contextUser.user]);


  const handleNavigation = (route) => {
    setShowKYC1(false);
    setShowKYC2(false);
    setShowKYC3(false);
    navigation.navigate(route);
  };
  const validate = () => {
    if (!title) return 'Contract title is required';
    if (paymentType === 'One time payment' && !amount) return 'Amount is required';
    if (paymentType === 'Installmental payment' && installments.some(inst => !inst.amount || !inst.date)) return 'All installments require an amount and date';
    return null;
  };

  const submitContractor = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      Alert.alert('Validation Error', errorMsg);
      return;
    }

    try {
      const contractorData = {
        userId: contextUser.user.id,
        title,
        description,
        duration,
        paymentType,
        amount: paymentType === 'One time payment' ? amount : undefined,
        installments: paymentType === 'Installmental payment' ? installments : undefined,
      };

      const link = await createContractor(contractorData);
      setEscrowLink(link);
    } catch (error) {
      Alert.alert('Submit Failed', error.message || 'Submit failed');
    }
  };

  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
    if (value === 'Installmental payment') {
      setInstallments([{ amount: '', date: '' }]);
    }
  };

  const handleInstallmentChange = (index, key, value) => {
    const newInstallments = [...installments];
    newInstallments[index][key] = value;
    setInstallments(newInstallments);
  };

  const addInstallment = () => {
    setInstallments([...installments, { amount: '', date: '' }]);
  };

  const removeInstallment = (index) => {
    const newInstallments = installments.filter((_, i) => i !== index);
    setInstallments(newInstallments);
  };

  return (
    <ScrollView style={{backgroundColor:'#fff'}}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Buyer1')} style={localStyles.arrowButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.title}>New Xkrow transaction</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbox')} style={localStyles.chatButton}>
          <FontAwesomeIcon icon={faCommentDots} size={17} />
        </TouchableOpacity>
      </View>

      <View style={localStyles.formContainer}>
        <Text style={styles.text4}>What contract would you like to do</Text>
        <Text style={styles.text5}>Contract Title</Text>
        <TextInput style={styles.input} placeholder='Enter title' keyboardType='default' value={title} onChangeText={setTitle} />

        <Text style={styles.text5}>Descriptions</Text>
        <TextInput style={styles.input} placeholder='Enter description' keyboardType='default' value={description} onChangeText={setDescription} />
        <Text style={styles.text5}>Duration</Text>
        <TextInput style={styles.input} placeholder='Enter Duration' keyboardType='default' value={duration} onChangeText={setDuration} />

        <Text style={styles.text5}>Type of payment</Text>
        <View  style={localStyles.picker}>
           <Picker
          selectedValue={paymentType}
          onValueChange={(itemValue) => handlePaymentTypeChange(itemValue)}
        >
          <Picker.Item label="One time payment" value="One time payment" />
          {/* <Picker.Item label="Installmental payment" value="Installmental payment" /> */}
        </Picker>
        </View>
       

        {paymentType === 'One time payment' ? (
          <>
            <Text style={styles.text5}>Amount</Text>
            <TextInput style={styles.input} placeholder='Enter amount' keyboardType='numeric' value={amount} onChangeText={setAmount} />
          </>
        ) : (
          <View>
            {installments.map((installment, index) => (
              <View key={index} style={localStyles.installmentRow}>
                <TextInput
                  style={[styles.input, localStyles.installmentInput]}
                  placeholder='Enter amount'
                  keyboardType='numeric'
                  value={installment.amount}
                  onChangeText={(value) => handleInstallmentChange(index, 'amount', value)}
                />
                <TextInput
                  style={[styles.input, localStyles.installmentInput]}
                  placeholder='Enter date'
                  value={installment.date}
                  onChangeText={(value) => handleInstallmentChange(index, 'date', value)}
                />
                {index > 0 && (
                  <TouchableOpacity onPress={() => removeInstallment(index)}>
                    <Text style={localStyles.removeInstallment}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={addInstallment}>
              <Text style={localStyles.addInstallment}>Add another installment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {error && <Text style={styles.text7}>{error.message}</Text>}
      <View style={styles.lastDown}>
        <TouchableOpacity
          style={styles.btn}
          onPress={submitContractor}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Link</Text>
          )}
        </TouchableOpacity>
      </View>
      {showKYC1 && <KYC onVerify={() => handleNavigation('Page1')} />}
      {showKYC2 && <KYC2 onVerify={() => handleNavigation('Page3')} />}
      {showKYC3 && <KYC3 onVerify={() => handleNavigation('Page4')} />}
      {escrowLink && <Xkrow escrowLink={escrowLink} />}
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    padding: 30,
    borderColor: 'rgba(102, 112, 133, 1)',
    borderWidth: 1,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom:10,
  },
  arrowButton: {
    position: 'absolute',
    top: 30,left:10,
    zIndex: 1000,
  },
  title: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
  chatButton: {
    position: 'absolute',
    top: '40%',
    zIndex: 1000,
    right: '5%',
  },
  formContainer: {
    padding: 20,
  
  },
  installmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  installmentInput: {
    flex: 1,
    marginRight: 10,
  },
  removeInstallment: {
    color: 'red',
  },
  addInstallment: {
    color: 'blue',
  },
});

export default Contractor;
