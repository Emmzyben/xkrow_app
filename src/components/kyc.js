import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import styles from '../styles/style';

const KYC = ({ onVerify }) => {
  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <Image source={require('../../assets/Group3.png')} size={20} />
        <Text style={localStyles.headerText}>Ready to transact?</Text>
        <Text style={localStyles.subHeaderText}>Upgrade your KYC today!</Text>
        <Text style={localStyles.descriptionText}>
          Kindly upgrade your account in order to perform your escrow transactions
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
    lineHeight: 23.05,
    textAlign: 'center',
    color: '#62248F',
  },
  subHeaderText: {
    fontSize: 13.34,
    fontWeight: '700',
    lineHeight: 26.05,
    textAlign: 'center',
    color: '#62248F',
  },
  descriptionText: {
    fontSize: 10.55,
    fontWeight: '600',
    lineHeight: 19.31,
    textAlign: 'center',
    color: '#62248F',
  },
  buttonText: {
    textAlign: 'center',color:'#fff'
  },
});

export default KYC;
