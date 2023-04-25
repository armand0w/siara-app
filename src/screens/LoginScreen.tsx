import { StackScreenProps } from '@react-navigation/stack';

import React, { useContext, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { Background } from '../components/Background';
import { PMGroupLogo } from '../components/PMGroupLogo';
import { loginStyles } from '../theme/loginTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

interface Props extends StackScreenProps<any, any>{}

export const LoginScreen = ({ navigation }: Props) => {
  const { signIn, errorMessage, removeError } = useContext(AuthContext);
  const { username, password, onChange } = useForm({
    username: '',
    password: '',
  });
  SplashScreen.hide();

  useEffect(() => {
    if ( errorMessage.length === 0 ) {
      return;
    }

    Alert.alert('Login incorrecto', errorMessage, [{
      text: 'Ok',
      onPress: removeError,
    }]);
  }, [ errorMessage ]);

  useEffect(() => {
    findUserName();
  }, []);

  const findUserName = async () => {
    const userNameStorage = await AsyncStorage.getItem('userName');

    if ( userNameStorage ) {
      onChange(userNameStorage, 'username');
    }
  };

  const onLogin = () => {
    Keyboard.dismiss();
    signIn({ username, password });
  };

  return (
    <>
      <Background/>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={ ( Platform.OS === 'ios' ) ? 'padding' : 'height' }
      >
        <View style={ loginStyles.formContainer }>
          <PMGroupLogo/>

          <Text style={ loginStyles.title }>Login SIARA</Text>

          <Text style={ loginStyles.label }>Usuario:</Text>
          <TextInput
            placeholder="Ingrese su usuario"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              ( Platform.OS === 'ios' && loginStyles.inputFieldIOS ),
            ]}
            selectionColor="white"
            autoCapitalize="none"
            autoCorrect={ false }
            onChangeText={ (value) => onChange(value, 'username') }
            value={ username }
            onSubmitEditing={ onLogin }
          />

          <Text style={ loginStyles.label }>Password:</Text>
          <TextInput
            placeholder="****"
            placeholderTextColor="rgba(255,255,255,0.4)"
            secureTextEntry
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              ( Platform.OS === 'ios' && loginStyles.inputFieldIOS ),
            ]}
            selectionColor="white"
            autoCapitalize="none"
            autoCorrect={ false }
            onChangeText={ (value) => onChange(value, 'password') }
            value={ password }
            onSubmitEditing={ onLogin }
          />

          <View style={ loginStyles.buttonContainer }>
            <TouchableOpacity
              activeOpacity={ 0.8 }
              style={ loginStyles.button }
              onPress={ onLogin }
            >
              <Text style={ loginStyles.buttonText }>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={ loginStyles.newUserContainer }>
            <TouchableOpacity
              activeOpacity={ 0.8 }
              onPress={ () => navigation.replace('StatusScreen') }
            >
              <Text style={ loginStyles.buttonText }>Estado de siara </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
