import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const FundSuccess = ({ onClose }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to Wallet
    navigation.navigate('Wallet');
    // Close the modal or component
    onClose();
  };

  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <FontAwesomeIcon icon={faCircleCheck} size={25} style={localStyles.icon} />
        <Text style={localStyles.mainText}>Done!</Text>
        <Text style={localStyles.subText}>Your wallet has been funded</Text>
        <TouchableOpacity style={styles.btn1} onPress={handlePress}>
          <Text style={localStyles.buttonText}>Okay, Cool</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  icon: {
    color: 'rgba(63, 188, 143, 1)',
  },
  mainText: {
    fontSize: 18.34,
    fontWeight: '700',
    lineHeight: 26.05,
    textAlign: 'center',
  },
  subText: {
    fontSize: 12.55,
    fontWeight: '600',
    lineHeight: 19.31,
    textAlign: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff'
  },
});

export default FundSuccess;
