import React, { useState } from 'react';
import { Text, TouchableOpacity, TextInput, Alert, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../backend/user';
import useFundWallet from '../../hooks/useFundWallet';
import FundSuccess from '../../components/fundSucess';
import Failure3 from '../../components/failure3';
import { PAYSTACK_PUBLIC_KEY } from '@env';
import { Paystack } from 'react-native-paystack-webview';
import styles from '../../styles/style';

const Fund = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPaystack, setShowPaystack] = useState(false);
  const { user } = useUser(); 
  const { fundWallet, loading, error } = useFundWallet();

  const callpaystack = () => {
    if (parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to fund.');
      return;
    }
    if (!user?.email || !validateEmail(user.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email.');
      return;
    }
    setShowPaystack(true);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const Pay = () => (
    <View style={{ flex: 1 }}>
      <Paystack
        paystackKey={PAYSTACK_PUBLIC_KEY}
        amount={parseFloat(amount)} 
        billingEmail={user.email}
        activityIndicatorColor="green"
        onCancel={() => {
          setPaymentStatus('failure');
          setShowPaystack(false);
        }}
        onSuccess={async () => {
          try {
            await fundWallet(parseFloat(amount));
            setPaymentStatus('success');
          } catch (err) {
            console.error('Error funding wallet:', err);
            setPaymentStatus('failure');
          }
          setShowPaystack(false);
        }}
        autoStart={true}
      />
    </View>
  );

  const handleClose = () => {
    setPaymentStatus(null);
    navigation.navigate('Wallet'); 
  };

  const handleClose2 = () => {
    setPaymentStatus(null);
    navigation.navigate('Fund'); 
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 30, borderBottomWidth: 1, borderBottomColor: 'rgba(102, 112, 133, 1)' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Wallet')} style={{ position: 'absolute', top: 30, left: 10 }}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 15.3, lineHeight: 18.52, fontWeight: '700', color: '#141414' }}>Fund Wallet</Text>
      </View>

      <View style={{ padding: 20 }}>
        <Text style={styles.text4}>Pay with your card</Text>
        <Text style={styles.text7}>Enter amount to continue</Text>
      </View>

      <View style={{ padding: 20 }}>
        <Text style={styles.text5}>Enter Amount to fund</Text>
        <TextInput
          value={amount}
          keyboardType="number-pad"
          onChangeText={setAmount}
          style={styles.input}
        />
      </View>

      <View style={styles.lastDown1}>
        <TouchableOpacity style={styles.btn} onPress={callpaystack} disabled={loading}>
          <Text style={{ color: '#fff' ,textAlign:'center'}}>{loading ? 'Processing...' : 'Fund With Paystack'}</Text>
        </TouchableOpacity>
      </View>

      {showPaystack && <Pay />}

      {paymentStatus === 'success' && <FundSuccess onClose={handleClose} />}
      {paymentStatus === 'failure' && <Failure3 onClose={handleClose2} />}
    </View>
  );
};

export default Fund;
