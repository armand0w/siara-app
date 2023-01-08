import React, { useContext, useEffect } from 'react';

import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginStyles } from '../theme/loginTheme';
import { PMGroupLogo } from '../components/PMGroupLogo';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any>{}

export const StatusScreen = ({ navigation }: Props) => {
  const { errorMessage, removeError } = useContext(AuthContext);
  const { name, email, password, onChange } = useForm({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if ( errorMessage.length === 0 ) {
      return;
    }

    Alert.alert('Registro incorrecto', errorMessage, [{
      text: 'Ok',
      onPress: removeError,
    }]);
  }, [ errorMessage ]);

  const onRegister = () => {
    console.log({ name, email, password });
    Keyboard.dismiss();
    // signUp({ nombre: name, correo: email, password });
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#ef5350' }}
        behavior={ ( Platform.OS === 'ios' ) ? 'padding' : 'height' }
      >
        <View style={ loginStyles.formContainer }>
          <PMGroupLogo/>

          <Text style={ loginStyles.title }>Registro</Text>

          <Text style={ loginStyles.label }>Nombre:</Text>
          <TextInput
            placeholder="Ingrese su nombre"
            placeholderTextColor="rgba(255,255,255,0.4)"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              ( Platform.OS === 'ios' && loginStyles.inputFieldIOS ),
            ]}
            selectionColor="white"
            autoCapitalize="words"
            autoCorrect={ false }
            onChangeText={ (value) => onChange(value, 'name') }
            value={ name }
            onSubmitEditing={ onRegister }
          />

          <Text style={ loginStyles.label }>Email:</Text>
          <TextInput
            placeholder="Ingrese su email"
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
            onChangeText={ (value) => onChange(value, 'email') }
            value={ email }
            onSubmitEditing={ onRegister }
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
            onSubmitEditing={ onRegister }
          />

          <View style={ loginStyles.buttonContainer }>
            <TouchableOpacity
              activeOpacity={ 0.8 }
              style={ loginStyles.button }
              onPress={ onRegister }
            >
              <Text style={ loginStyles.buttonText }>Crear cuenta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={ () => navigation.replace('LoginScreen')}
            activeOpacity={ 0.8 }
            style={ loginStyles.buttonReturn }
          >
            <Text style={ loginStyles.buttonText }>Login</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </>
  );
};
