import {StyleSheet} from 'react-native';

export const colors = {
  buttonBlue: '#147efb',
  secondaryBlue: '#cfe5ff',
};

export const defaultBorderRadius = 15;
export const largeBorderRadius = 20;
export const defaultPadding = 10;
export const defaultGap = 5;

export const styles = StyleSheet.create({
  roundedButton1: {
    padding: defaultPadding,
    borderRadius: defaultBorderRadius,
    backgroundColor: colors.buttonBlue,
  },
  defaultHeader: {fontSize: 22, fontWeight: 'bold'},
  buttonText1: {color: 'white', textTransform: 'uppercase', fontWeight: 'bold'},
});
