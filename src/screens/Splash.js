import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text
} from 'react-native';
import { scale, scaleFont } from '../utils/common';
import { useNavigation } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);

  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={require('./../assets/images/splash_bg.png')}
        resizeMode='cover'
      />
      <View style={styles.centerContainer}>
        <Image
          source={require('./../assets/images/splash_icon.png')}
          style={styles.icon}
        />
        <Text style={styles.text}>
          GPA CALCULATOR
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centerContainer: {
    position: 'absolute',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH,
    height: HEIGHT
  },
  icon: {
    height: scale(200),
    width: scale(200),
  },
  text: {
    paddingTop: scale(40),
    color: 'white',
    fontSize: scaleFont(30),
    fontWeight: 'bold',
    paddingBottom: scale(40)
  }
});

export default Splash;