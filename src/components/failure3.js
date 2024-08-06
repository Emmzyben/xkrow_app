import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const Failure3 = ({ onClose }) => {
  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <FontAwesomeIcon icon={faCircleExclamation} size={25} style={localStyles.icon} />
        <Text style={localStyles.mainText}>Funding Unsuccessful</Text>
        <View style={localStyles.buttonContainer}>
          <TouchableOpacity style={styles.btn1} onPress={onClose}>
            <Text style={localStyles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  icon: {
    color: 'rgba(204, 98, 98, 1)',
  },
  mainText: {
    fontSize: 18.34,
    fontWeight: '700',
    lineHeight: 26.05,
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff'
  },
});

export default Failure3;
