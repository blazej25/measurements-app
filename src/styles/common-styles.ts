import {StyleSheet} from 'react-native';

export const colors = {
  buttonBlue: '#147EFB',
};

export const styles = StyleSheet.create({
  roundedButton1: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: colors.buttonBlue,
    marginRight: 5,
  },
  defaultHeader: {fontSize: 22, fontWeight: 'bold'},
  buttonText1: {color: 'white', textTransform: 'uppercase', fontWeight: 'bold'},
});
