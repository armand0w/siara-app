import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    height: 600,
    marginBottom: 50,
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  label: {
    marginTop: 25,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  inputField: {
    color: '#ffffff',
    fontSize: 20,
  },
  inputFieldIOS: {
    borderBottomColor: '#ffffff',
    borderBottomWidth: 2,
    paddingBottom: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  button: {
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 100,
  },
  newUserContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  buttonReturn: {
    position: 'absolute',
    top: 50,
    left: 20,
    borderWidth: 0.5,
    borderColor: '#ffffff',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 15,
    color: '#F3F3F3',
  },
});
