import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Hero from '../../components/hero';
import Nav from '../../components/nav';
import Transactions from '../../components/transactions';
import { StyleSheet } from 'react-native';


const FundTransactions = ({ navigation }) => {
  return (
    <View style={styless.container}>

        <View style={styles.top}>
          <View style={styles.top1}>
    <Text style={styles.text2}>Recent transactions</Text>
    </View> 
    <View>
    <TouchableOpacity  style={styles.top1}  onPress={() => navigation.navigate('Notification')}>
          <FontAwesome5 name="bell" size={17} style={styles.icon} />
        </TouchableOpacity>

    </View>
     </View>
 


<Transactions/>




<Nav/>

    </View>
  );
};
const styless = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default FundTransactions;
