import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet ,ScrollView} from 'react-native' ;
import styles from '../../styles/style';

const Page5 = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Landing');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ScrollView style={styles.login}>
      <Text style={styles.text}>Your submission is under review</Text>
      <Text style={styles.text6}>Your personal information and address is being reviewed</Text>

      <View style={styles.container}>
        <Text style={styles.progressTitle}>Progress</Text>
        <View style={styles.progress}>
          <View style={styles.udn1}>
            <Image style={styles.img2} source={require('../../../assets/StepSymbol.png')} />
          </View>
          <View style={styles.udn}>
            <Text style={styles.text6}>Personal Information: Your personal information and Phone number has been verified on NIMC. Personal Information</Text>
          </View>
        </View>

        <View style={styles.progress}>
          <View style={styles.udn1}>
            <Image style={styles.img2} source={require('../../../assets/StepSymbol.png')} />
          </View>
          <View style={styles.udn}>
            <Text style={styles.text6}>Face verification: Your face capture has been verified. Personal Information</Text>
          </View>
        </View>

        <View style={styles.progress}>
          <View style={styles.udn1}>
            <Image style={styles.img2} source={require('../../../assets/StepSymbol1.png')} />
          </View>
          <View style={styles.udn}>
            <Text style={styles.text6}>ID Card verification: Your details are being checked and will be verified within 2 minutes. Personal Information</Text>
          </View>
        </View>

        <View style={styles.progress}>
          <View style={styles.udn1}>
            <Image style={styles.img2} source={require('../../../assets/StepSymbol1.png')} />
          </View>
          <View style={styles.udn}>
            <Text style={styles.text6}>BVN Verification: Your details are being checked and will be verified within 2 minutes. Personal Information</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginTop: 25,
  },
  progressTitle: {
    fontSize: 17,
    color: "rgba(98, 36, 143, 1)",
    fontWeight: '600',
  },
});

export default Page5;
