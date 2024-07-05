/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './src/localization/i18n';
import Text from 'react-native';

AppRegistry.registerComponent(appName, () => App);

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
