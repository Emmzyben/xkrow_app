import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const Successfull = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <FontAwesomeIcon icon={faCircleCheck} size={25} style={localStyles.icon} />
        <Text style={localStyles.title}>Successful!</Text>
        <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('Profile')}>
        <Text  style={{color:'#fff'}}>Okay, Cool</Text>  
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  icon: {
    color: 'rgba(63, 188, 143, 1)',
  },
  title: {
    fontSize: 18.34,
    fontWeight: '700',
    lineHeight: 26.05,
    textAlign: 'center',
  },
});

export default Successfull;
