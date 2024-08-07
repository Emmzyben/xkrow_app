import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useGetContractor from '../../hooks/useGetContractor';
import { useUser } from '../../backend/user';

const Professionals1 = ({ navigation }) => {
  const [escrowLink, setEscrowLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { getContractor, loading } = useGetContractor();
  const { user } = useUser();

  const handleContinue = async () => {
    try {
      const contractorData = await getContractor(escrowLink);

      if (typeof contractorData.installments === 'string') {
        contractorData.installments = JSON.parse(contractorData.installments);
      }

      if (contractorData.user_id === user.id) {
        setErrorMessage('You cannot proceed with this contractor as you are the same user.');
        return;
      }

      navigation.navigate('Professionals2', { contractorData });
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Buyer1')} style={localStyles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.title}>New Xkrow transaction</Text>
      </View>

      <View style={localStyles.formContainer}>
        <Text style={styles.text5}>Enter Xkrow link</Text>
        <TextInput 
          value={escrowLink} 
          onChangeText={setEscrowLink} 
          style={styles.xkrow} 
        />
      </View>

      <View style={styles.lastDown1}>
        {escrowLink && (
          <TouchableOpacity 
            style={styles.btn} 
            onPress={handleContinue} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue to accept</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {errorMessage && (
        <Text style={localStyles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderColor: 'rgba(102, 112, 133, 1)',
    borderWidth: 1,
    position: 'relative',paddingTop:50
  },
  backButton: {
    position: 'absolute',
    top: 50,left:20,
    zIndex: 1000,
  },
  title: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
  formContainer: {
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Professionals1;
