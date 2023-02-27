import React, { useContext, useEffect, useState } from 'react';

import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { loginStyles } from '../theme/loginTheme';
import { PMGroupLogo } from '../components/PMGroupLogo';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { getStatus } from '../api/siaraApi';
import { ServiceStatus } from '../interfaces/appInterfaces';
import { colors } from '../theme/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Props extends StackScreenProps<any, any>{}


export const StatusScreen = ({ navigation }: Props) => {
  const { errorMessage, removeError } = useContext(AuthContext);
  const [ page, setPage ] = useState<ServiceStatus>();
  const [ ldap, setLdap ] = useState<ServiceStatus>();
  const [ rest, setRest ] = useState<ServiceStatus>();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    if ( errorMessage.length === 0 ) {
      return;
    }

    Alert.alert('Error', errorMessage, [{
      text: 'Ok',
      onPress: removeError,
    }]);
  }, [ errorMessage ]);

  useEffect(() => {
    testStatus();
  }, []);

  const testStatus = async () => {
    const pageAux = await getStatus('');
    const ldapAux = await getStatus('/api-rest-siara-ldap-jwt');
    const restAux = await getStatus('/api-rest-siara/usuarios');

    setPage(pageAux);
    setLdap(ldapAux);
    setRest(restAux);
  };

  const getBadge = ( data: ServiceStatus ) => {

    return (
      <View >
        <Text style={ loginStyles.statusText }>
          {
            ( data.code === 200 || data.code === 401 ) ?
              'OK' :
              'Error: ' + data.message
          }
        </Text>
      </View>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: isDarkMode ? colors.secondary : colors.primary }}
        behavior={ ( Platform.OS === 'ios' ) ? 'padding' : 'height' }
      >
        <View style={ loginStyles.formContainer }>
          <PMGroupLogo/>

          <Text style={ loginStyles.title }>SIARA</Text>

          <Text style={ loginStyles.label }>Pagina principal:</Text>
          <TouchableOpacity
            activeOpacity={ 0.8 }
            style={{ borderColor: Colors.white }}
          >
            { page && getBadge(page) }
          </TouchableOpacity>

          <Text style={ loginStyles.label }>Siara ldap:</Text>
          <TouchableOpacity
            activeOpacity={ 0.8 }
            style={{ borderColor: Colors.white }}
          >
            { ldap && getBadge(ldap) }
          </TouchableOpacity>

          <Text style={ loginStyles.label }>Siara rest:</Text>
          <TouchableOpacity
            activeOpacity={ 0.8 }
            style={{ borderColor: Colors.white }}
          >
            { rest && getBadge(rest) }
          </TouchableOpacity>

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
