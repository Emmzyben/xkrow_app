import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { useNavigation } from '@react-navigation/native';

const KYC2 = ({ onVerify }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <Image source={require('../../assets/Group3.png')} size={20} />
        <Text style={localStyles.headerText}>Ready to transact?</Text>
        <Text style={localStyles.subHeaderText}>Upgrade your KYC today!</Text>
        <Text style={localStyles.descriptionText}>
          Kindly complete your KYC in order to perform your escrow transactions
        </Text>
        <TouchableOpacity style={styles.btn1} onPress={onVerify}>
          <Text style={localStyles.buttonText}>Verify profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  headerText: {
    fontSize: 13.34,
    fontWeight: '700',
    lineHeight: 26.05,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 13.34,
    fontWeight: '700',
    lineHeight: 26.05,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 10.55,
    fontWeight: '600',
    lineHeight: 19.31,
    textAlign: 'center',
  },
  buttonText: {
    textAlign: 'center',color:'#fff'
  },
});

export default KYC2;
