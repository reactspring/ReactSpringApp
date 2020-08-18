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
  Button,
  NativeModules
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import ReactNativeBiometrics from 'react-native-biometrics'
import Toast from 'react-native-simple-toast';

class App extends React.Component<Props> {
  constructor(props: Readonly<{}>) {
    super(props);
  }

  state = {
    isKey: false,
    public_key: ""
  };

  render () {
    console.log ("render");

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>MD5 메시지 다이제스트</Text>
                <Text style={styles.sectionDescription}>{this.getMD5("1234")}</Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>React Native 생체인증</Text>
                <View style={{ width: '100%', height: 1, backgroundColor: '#fff', padding:5 }} />
                <Button
                  onPress={this.checkFingerprint.bind(this)}
                  title="생체인증 지원여부 확인"
                  color="#3394ee"
                  accessibilityLabel=""
                />
                <View style={{ width: '100%', height: 1, backgroundColor: '#fff', padding:5 }} />

                <Button
                  onPress={this.biometricKeysExist.bind(this)}
                  title="키존재 여부 확인"
                  color="#3394ee"
                  accessibilityLabel=""
                />
                <View style={{ width: '100%', height: 1, backgroundColor: '#fff', padding:5 }} />

                <Button
                  onPress={this.createKeys.bind(this)}
                  title="RSA 2048 키 생성"
                  color="#3394ee"
                  accessibilityLabel=""
                />   
                <View style={{ width: '100%', height: 1, backgroundColor: '#fff', padding:5 }} />

                <Button
                  onPress={this.deleteKeys.bind(this)}
                  title="RSA 2048 키 삭제"
                  color="#3394ee"
                  accessibilityLabel=""
                />               
                <View style={{ width: '100%', height: 1, backgroundColor: '#fff', padding:5 }} />

                <Button
                  onPress={this.createSignature.bind(this)}
                  title="전자서명"
                  color="#3394ee"
                  accessibilityLabel=""
                />                  
                <View style={{ width: '100%', height: 1, backgroundColor: '#fff', padding:5 }} />

                <Button
                  onPress={this.simplePrompt.bind(this)}
                  title="생체인증"
                  color="#3394ee"
                  accessibilityLabel=""
                />                  
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>RSA 2048 공개키</Text>
                <Text style={styles.sectionDescription}>{this.state.public_key}</Text>
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

  private async createKeys () {
    await ReactNativeBiometrics.createKeys().then((resultObject) => {
      const { publicKey } = resultObject
      // sendPublicKeyToServer(publicKey)

      Toast.show (publicKey);
      this.state.isKey = true;
      this.setState ({isKey:true, public_key:publicKey});
    })    
  }

  private deleteKeys () {
    ReactNativeBiometrics.deleteKeys().then((resultObject) => {
      const { keysDeleted } = resultObject
  
      if (keysDeleted) {
        Toast.show ('Successful deletion')
        this.setState ({isKey:false, public_key:""});
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
    ReactNativeBiometrics.biometricKeysExist().then((resultObject) => {
      const { keysExist } = resultObject
  
      if (keysExist) {
        this.setState ({isKey:true, public_key:"Keys exist"});
      } else {
        this.setState ({isKey:false, public_key:"Keys do not exist or were deleted"});
      }
    })
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
    color: '#dedede'
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
