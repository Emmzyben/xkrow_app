import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import styles from '../../styles/style';

const Page1 = ({ navigation }) => {

  return (
    <ScrollView style={styles.kyc1}>
      <View style={styles.maincontainer}>
        <Text style={styles.text1}>Details to provide</Text>
        <Text style={styles.text3}>The following are information we want from you</Text>

        <Text style={styles.text2}>KYC Requirement</Text>

        <View style={styles.steps}>
          <View style={styles.stepsUnder}>
            <View>
              <Image style={styles.img1} source={require('../../../assets/Featured.png')} />
            </View>
            <View>
              <Text style={styles.text4}>Personal information</Text>
              <Text style={styles.text3}>Provide your First name,{'\n'}Last name, and Address.</Text>
            </View>
          </View>

          <View style={styles.stepsUnder}>
            <View>
              <Image style={styles.img1} source={require('../../../assets/Featuredicon.png')} />
            </View>
            <View>
              <Text style={styles.text4}>BVN</Text>
              <Text style={styles.text3}>Provide us with your BVN and{'\n'}NIN number respectively.</Text>
            </View>
          </View>

          <View style={styles.stepsUnder}>
            <View>
              <Image style={styles.img1} source={require('../../../assets/icon.png')} />
            </View>
            <View style={localStyles.stepDetails}>
              <Text style={styles.text4}>Face Verification</Text>
              <Text style={styles.text3}>Get a face shot by following the{'\n'}instructions that will be provided.</Text>
            </View>
          </View>

          <View style={styles.stepsUnder}>
            <View>
              <Image style={styles.img1} source={require('../../../assets/icon.png')} />
            </View>
            <View>
              <Text style={styles.text4}>ID Card Verification</Text>
              <Text style={styles.text3}>Provide us with a passport{'\n'}photograph and Valid ID card.</Text>
            </View>
          </View>
        </View>

      </View>

      <Text style={localStyles.footerText}>
        By clicking on Accept and Proceed, you consent to provide us with the requested data.
      </Text>

      <View style={styles.lastDown}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Page2')}><Text style={{color:'#fff',textAlign:'center'}}>Accept and Proceed</Text></TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  footerText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
    color: 'rgba(102, 112, 133, 1)',
    marginVertical: 10, // Add margin to avoid touching edges
  },
  stepDetails: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
});

export default Page1;
