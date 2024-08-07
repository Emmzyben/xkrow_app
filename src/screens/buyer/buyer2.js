import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useGetVendor from '../../hooks/useGetVendor';

const Buyer2 = ({ navigation }) => {
  const [escrowLink, setEscrowLink] = useState('');
  const { getVendor, loading, error } = useGetVendor();

  const handleContinueToPay = async () => {
    try {
      const vendorData = await getVendor(escrowLink);
      navigation.navigate('Buyer3', { vendorData });
    } catch (error) {
      // Error is handled by setting the state and displaying below input
    }
  };

  return (
    <View style={{backgroundColor:"#fff",height:'100%'}}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Buyer1')} style={localStyles.arrowButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.title}>New Xkrow transaction</Text>
      </View>

      <View style={localStyles.findVendorsContainer}>
        <View><Text style={styles.text5}></Text></View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Vendors')}>
            <Text style={localStyles.findVendorsText}>
              Find vendors <FontAwesomeIcon icon={faArrowRight} style={localStyles.arrowIcon} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recent}>
        {/* Add content for recent transactions */}
      </View>

      <View style={localStyles.inputContainer}>
        <Text style={styles.text5}>Enter Xkrow link</Text>
        <TextInput
          value={escrowLink}
          onChangeText={setEscrowLink}
          keyboardType='text'
          style={styles.xkrow}
        />
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </View>

      <View style={localStyles.footer}>
        <Text style={styles.text9}>
          I don't have a link  
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Vendors')}>
            <Text style={styles.text8}>Find Vendors</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.lastDown1}>
        <TouchableOpacity style={styles.btn} onPress={handleContinueToPay} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Continue to pay</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  header: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 112, 133, 1)',
    position: 'relative',paddingTop:50
  },
  arrowButton: {
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
  findVendorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  findVendorsText: {
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '500',
    color: '#3A0064',
  },
  arrowIcon: {
    position: 'relative',
    top: 4,
  },
  inputContainer: {
    padding: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default Buyer2;
