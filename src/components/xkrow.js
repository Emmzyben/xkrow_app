import React from 'react';
import { View, Text, TouchableOpacity, Clipboard, Alert, Share, StyleSheet } from 'react-native';
import styles from '../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const Xkrow = ({ escrowLink }) => {
  const navigation = useNavigation();

  const copyToClipboard = () => {
    Clipboard.setString(escrowLink);
    Alert.alert("Copied to clipboard");
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `Check out this escrow link: ${escrowLink}`,
      });
    } catch (error) {
      Alert.alert('Error sharing the link', error.message);
    }
  };

  return (
    <View style={styles.bgcover}>
      <View style={styles.box}>
        <Text style={styles.text5}>Escrow url is Enabled!</Text>
        <Text style={styles.text7}>You are now enabling an escrow url. It means you can share with your customer</Text>
        <Text style={styles.text7}>Your escrow url:</Text>
        <Text style={styles.text4}>{escrowLink}</Text>
        <Text style={styles.text7}>
          <FontAwesomeIcon 
            icon={faCopy} 
            size={15} 
            style={localStyles.copyIcon} 
            onPress={copyToClipboard} 
          /> 
          click to copy
        </Text>
        <View style={localStyles.buttonContainer}>
          <TouchableOpacity style={styles.btn3} onPress={() => navigation.goBack()}>
          <Text  style={{color:'#fff'}}>Close</Text> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn1} onPress={shareLink}>
           <Text  style={{color:'#fff',textAlign:'center'}}>Share</Text> 
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  copyIcon: {
    color: 'rgba(63, 188, 143, 1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default Xkrow;
