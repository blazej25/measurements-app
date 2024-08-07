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
  },
  navigationButton: {
    borderRadius: defaultBorderRadius,
    flexDirection: 'row',
    margin: defaultGap,
    paddingHorizontal: defaultPadding,
    backgroundColor: 'white',
    alignItems: 'center',
    height: 40,
  },
  secondaryNavigationButton: {
    borderRadius: defaultBorderRadius,
    flexDirection: 'row',
    margin: defaultGap,
    paddingHorizontal: defaultPadding,
    alignItems: 'center',
    height: 40,
    alignSelf: 'center',
    backgroundColor: colors.secondaryBlue,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryBlue,
    marginHorizontal: defaultGap,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: defaultBorderRadius,
    margin: defaultGap,
    paddingHorizontal: defaultPadding,
    height: 40,
  },
  actionButtonText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    alignSelf: 'center',
    margin: defaultGap,
    color: colors.buttonBlue,
  },
  uiPromptText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.buttonBlue,
    alignSelf: 'center',
  },
  explanationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.buttonBlue,
    alignSelf: 'flex-start',
    marginHorizontal: 10,
  },
  defaultScrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    gap: defaultGap,
  },
  buttonContainer: {
    borderRadius: largeBorderRadius,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: colors.secondaryBlue,
    padding: defaultPadding,
    alignSelf: 'center',
    gap: defaultGap,
  },
  saveIcon: {marginTop: 10},
});
