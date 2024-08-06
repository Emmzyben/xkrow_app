import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert ,ScrollView} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useCreateTransfer from '../../hooks/useCreateTransfer'; // Adjust the path as needed
import styles from '../../styles/style'; // Assuming styles are defined here
import BankSelect from '../../components/BankSelect'; // Adjust the path as needed

const Withdraw = ({ navigation }) => {
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');

  const { createTransfer, loading, error, result } = useCreateTransfer();

  const handleConfirm = async () => {
    if (bankCode && accountNumber && accountName && amount) {
      await createTransfer(bankCode, accountNumber, accountName, amount);
    } else {
      Alert.alert('Validation Error', 'Please fill all fields.');
    }
  };

  useEffect(() => {
    if (result) {
      Alert.alert('Success', 'Transfer Successful!');
    }
  }, [result]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <ScrollView>
      <View style={styless.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Wallet')}
          style={styless.button}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={styless.title}>Withdraw</Text>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <View>
          <Text style={styles.text4}>Send to your bank account</Text>
          <Text>{'\n'}</Text>
          <Text style={styles.text7}>Kindly enter and confirm your bank details</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <Text style={styles.text5}>Account Name</Text>
        <TextInput
          value={accountName}
          onChangeText={setAccountName}
          keyboardType='default'
          style={styles.input}
        />
        <Text style={styles.text5}>Account No.</Text>
        <TextInput
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType='numeric'
          style={styles.input}
        />
        <Text style={styles.text5}>Bank Name</Text>
        <BankSelect selectedBank={bankCode} onBankChange={setBankCode} />
        <Text style={styles.text5}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType='numeric'
          style={styles.input}
        />
      </View>

      <View style={styles.lastDown1}>
        <TouchableOpacity
          style={styless.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styless.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" />}
      </View>
    </ScrollView>
  );
};

const styless = StyleSheet.create({
  container: {
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(102, 112, 133, 1)',
  },
  button: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1000,
  },
  title: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.51,
    fontWeight: '700',
    color: '#141414',
  },
  confirmButton: {
    backgroundColor: 'rgba(98, 36, 143, 1)', // Desired background color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff', // Text color
    fontSize: 16,
  },
});

export default Withdraw;
