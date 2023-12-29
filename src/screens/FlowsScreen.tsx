import React, { useState } from 'react';
import { Button, Text, View} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { Screens } from '../constants';
import { TextInput } from 'react-native';
import { NumberInputBar, SelectorBar } from '../components/input-bars';

export const FlowsScreen = ({navigation}: {navigation: any}) => {
  const [liczbaKroccow, setLiczbaKroccow] = useState(0)
  const [iloscPunktow, setIloscPunktow] = useState(0)
  const [WymiaryPrzewodu, setWymiaryPrzewodu] = useState([0, 0])
  const [średnicaPrzewodu, setŚrednicaPrzewodu] = useState(0)
  const [tryb, setTryb] = useState(false)

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: 'black'}}> Przepływy </Text>
      <SelectorBar
        label={'Rodzaj przewodu'}
        selections={['Kołowy', 'Prostokątny']}
        onSelect={(selectedItem: string, _index: number) => {
          setTryb(selectedItem !== 'Kołowy')
        }}
      />
      {tryb ?
      <>
      <NumberInputBar
        placeholder=""
        valueUnit="m"
        value={WymiaryPrzewodu[0]}
        onChangeText={text => {
          const width = WymiaryPrzewodu[1];
          const height = parseFloat(text);
          const new_value = [height, width];
          setWymiaryPrzewodu(new_value);
        }}
        label={'Wysokość'}
      />
      <NumberInputBar
        placeholder=""
        valueUnit="m"
        value={WymiaryPrzewodu[1]}
        onChangeText={text => {
          const height = WymiaryPrzewodu[0];
          const width = parseFloat(text);
          const new_value = [height, width];
          setWymiaryPrzewodu(new_value);
        }}
        label={'Szerokość'}
      /> 
      </> :
      <NumberInputBar
        placeholder=""
        valueUnit="m"
        value={średnicaPrzewodu}
        onChangeText={text => setŚrednicaPrzewodu(parseFloat(text))}
        label={'Średnica przewodu'}
      />
      }
      <TextInput 
      onChangeText={text => setLiczbaKroccow(parseInt(text))}
      style={{color: 'black'}}
      defaultValue={'0'}
      />
      <TextInput 
      onChangeText={text => setIloscPunktow(parseInt(text))}
      style={{color: 'black'}}
      defaultValue={'0'}
      />
      <Button
      onPress={() => {console.log(liczbaKroccow, iloscPunktow)}}
      title={'Press me'}
      />
    </View>
  );
};
