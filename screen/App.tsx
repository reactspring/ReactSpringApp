/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Props } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ReactNativeBiometrics from 'react-native-biometrics'
import Toast from 'react-native-simple-toast';

interface Props {}
interface State {}

let public_key:string = "";

class App extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined
    };
  }
  
  render () {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>React Native 생체인증</Text>
              </View>
              <View style={styles.sectionContainer}>
                <Button
                  onPress={this.checkFingerprint}
                  title="생체인증 지원여부 확인"
                  color="#3394ee"
                  accessibilityLabel=""
                />
                <View style={{ width: '100%', height: 1, backgroundColor: '#ddd', padding:5 }} />

                <Button
                  onPress={this.biometricKeysExist}
                  title="키존재 여부 확인"
                  color="#3394ee"
                  accessibilityLabel=""
                />
                <View style={{ width: '100%', height: 1, backgroundColor: '#ddd', padding:5 }} />

                <Button
                  onPress={this.createKeys}
                  title="RSA 2048 키 생성"
                  color="#3394ee"
                  accessibilityLabel=""
                />   
                <View style={{ width: '100%', height: 1, backgroundColor: '#ddd', padding:5 }} />

                <Button
                  onPress={this.deleteKeys}
                  title="RSA 2048 키 삭제"
                  color="#3394ee"
                  accessibilityLabel=""
                />               
                <View style={{ width: '100%', height: 1, backgroundColor: '#ddd', padding:5 }} />

                <Button
                  onPress={this.createSignature}
                  title="전자서명"
                  color="#3394ee"
                  accessibilityLabel=""
                />                  
                <View style={{ width: '100%', height: 1, backgroundColor: '#ddd', padding:5 }} />

                <Button
                  onPress={this.simplePrompt}
                  title="생체인증"
                  color="#3394ee"
                  accessibilityLabel=""
                />                  
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };

  private getMD5 (plain:string) {
    var md5 = require('md5');
    const hash_message = md5(plain);

    console.log("hash_message : " + hash_message);
    return hash_message;
  }

  private checkFingerprint () {
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const { available, biometryType } = resultObject
   
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        Toast.show ("TouchID is supported", Toast.LONG);
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        Toast.show ("FaceID is supported", Toast.LONG);
      } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        Toast.show ("Biometrics is supported", Toast.LONG);
      } else {
        Toast.show ("Biometrics not supported", Toast.LONG);
      }
    }) 
  }

  private biometricKeysExist () {
    ReactNativeBiometrics.biometricKeysExist().then((resultObject) => {
      const { keysExist } = resultObject
  
      if (keysExist) {
        Toast.show ('Keys exist')
      } else {
        Toast.show ('Keys do not exist or were deleted')
      }
    })
  }

  private createKeys () {
    ReactNativeBiometrics.createKeys().then((resultObject) => {
      const { publicKey } = resultObject
      Toast.show (publicKey)
      // sendPublicKeyToServer(publicKey)
      public_key = publicKey;
    })    
  }

  private deleteKeys () {
    ReactNativeBiometrics.deleteKeys().then((resultObject) => {
      const { keysDeleted } = resultObject
  
      if (keysDeleted) {
        Toast.show ('Successful deletion')
      } else {
        Toast.show ('Unsuccessful deletion because there were no keys to delete')
      }
    })    
  }

  private createSignature () {
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
    let payload = epochTimeSeconds + 'some message'
    
    ReactNativeBiometrics.createSignature({
        promptMessage: '전자서명',
        payload: payload
      }).then((resultObject) => {
        const { success, signature } = resultObject
    
        if (success) {
          console.log("signature : " + signature);
          console.log("payload : " + payload);
          // verifySignatureWithServer(signature, payload)
        }
      })
  }

  private simplePrompt () {
    ReactNativeBiometrics.simplePrompt({promptMessage: '지문인증'}).then((resultObject) => {
      const { success } = resultObject

      if (success) {
        Toast.show ('successful biometrics provided')
      } else {
        Toast.show ('user cancelled biometric prompt')
      }
    })
    .catch(() => {
      console.log('biometrics failed')
    })
  }

  async componentDidMount () {
    // const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()

    // if (biometryType === ReactNativeBiometrics.TouchID) {
    //   console.log('TouchID is supported')
    // } else if (biometryType === ReactNativeBiometrics.FaceID) {
    //   console.log('FaceID is supported')
    // } else if (biometryType === ReactNativeBiometrics.Biometrics) {
    //   console.log('Biometrics is supported')
    // } else {
    //   console.log('Biometrics not supported')
    // }
  }
  
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
