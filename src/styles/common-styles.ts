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
  mainContainer: {
    margin: defaultGap,
    flex: 1,
    justifyContent: 'flex-start',
    gap: defaultGap,
  },
  defaultView: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: defaultGap,
  },
  roundedButton1: {
    padding: defaultPadding,
    borderRadius: defaultBorderRadius,
    backgroundColor: colors.buttonBlue,
  },
  defaultHeader: {fontSize: 22, fontWeight: 'bold'},
  buttonText1: {color: 'white', textTransform: 'uppercase', fontWeight: 'bold'},
  dataSelectorText: {
    height: 40,
    textAlignVertical: 'center',
    color: 'black',
    fontSize: 14,
  },
});
