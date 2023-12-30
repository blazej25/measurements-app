import React, { useState } from 'react';
import { Button, ScrollView, Text, View} from 'react-native';
import { NavigationButton } from '../components/buttons';
import { Screens } from '../constants';
import { TextInput } from 'react-native';
import { NumberInputBar, SelectorBar } from '../components/input-bars';
import { defaultGap } from '../styles/common-styles';

interface SingleFlowMeasurement{
  dynamicPressure: number[];
  staticPressure: number;
  temperature: number;
  angle: number;
}

const initialState: SingleFlowMeasurement = {
  dynamicPressure: [],
  staticPressure: 0,
  temperature: 0,
  angle: 0
}

export const FlowsScreen = ({navigation}: {navigation: any}) => {
  const [numberOfSpigots, setNumberOfSpigots] = useState(0)
  const [numberOfPoints, setNumberOfPoints] = useState(0)
  const [pipeDimensions, setPipeDimensions] = useState([0, 0])
  const [pipeDiameter, setPipeDiameter] = useState(0)
  const [mode, setMode] = useState(false)
  const [currentMeasurement, setCurrentMeasurement] = useState(initialState)

  const updateSingleFlowMeasurement = (field: any) => {
    setCurrentMeasurement({
      ...currentMeasurement,
      ...field,
    });
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-start', gap: defaultGap}}>
        <SelectorBar
          label={'Rodzaj przewodu'}
          selections={['Kołowy', 'Prostokątny']}
          onSelect={(selectedItem: string, _index: number) => {
            setMode(selectedItem !== 'Kołowy')
          }}
        />
        {mode ?
        <>
        <NumberInputBar
          placeholder=""
          valueUnit="m"
          value={pipeDimensions[0]}
          onChangeText={text => {
            const width = pipeDimensions[1];
            const height = parseFloat(text);
            const new_value = [height, width];
            setPipeDimensions(new_value);
          }}
          label={'Wysokość'}
        />
        <NumberInputBar
          placeholder=""
          valueUnit="m"
          value={pipeDimensions[1]}
          onChangeText={text => {
            const height = pipeDimensions[0];
            const width = parseFloat(text);
            const new_value = [height, width];
            setPipeDimensions(new_value);
          }}
          label={'Szerokość'}
        /> 
        </> :
        <NumberInputBar
          placeholder=""
          valueUnit="m"
          value={pipeDiameter}
          onChangeText={text => setPipeDiameter(parseFloat(text))}
          label={'Średnica przewodu'}
        />
        }
        <NumberInputBar
          placeholder=""
          value={numberOfSpigots}
          onChangeText={text => setNumberOfSpigots(parseFloat(text))}
          label={'Liczba króćców na obiekcie'}
        />
        <NumberInputBar
          placeholder=""
          value={numberOfPoints}
          onChangeText={text => setNumberOfPoints(parseFloat(text))}
          label={'Ilość punktów na osi'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.dynamicPressure[0]}
          onChangeText={text => {
            const value0 = parseFloat(text)
            const value1 = currentMeasurement.dynamicPressure[1]
            const value2 = currentMeasurement.dynamicPressure[2]
            const value3 = currentMeasurement.dynamicPressure[3]
            const newValue = [value0, value1, value2, value3]

            updateSingleFlowMeasurement({dynamicPressure: newValue})
          }}
          label={'Ciśnienie Dynamiczne 1'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.dynamicPressure[1]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0]
            const value1 = parseFloat(text)
            const value2 = currentMeasurement.dynamicPressure[2]
            const value3 = currentMeasurement.dynamicPressure[3]
            const newValue = [value0, value1, value2, value3]

            updateSingleFlowMeasurement({dynamicPressure: newValue})
          }}
          label={'Ciśnienie Dynamiczne 2'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.dynamicPressure[2]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0]
            const value1 = currentMeasurement.dynamicPressure[1]
            const value2 = parseFloat(text)
            const value3 = currentMeasurement.dynamicPressure[3]
            const newValue = [value0, value1, value2, value3]

            updateSingleFlowMeasurement({dynamicPressure: newValue})
          }}
          label={'Ciśnienie Dynamiczne 3'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.dynamicPressure[3]}
          onChangeText={text => {
            const value0 = currentMeasurement.dynamicPressure[0]
            const value1 = currentMeasurement.dynamicPressure[1]
            const value2 = currentMeasurement.dynamicPressure[2]
            const value3 = parseFloat(text)
            const newValue = [value0, value1, value2, value3]

            updateSingleFlowMeasurement({dynamicPressure: newValue})
          }}
          label={'Ciśnienie Dynamiczne 4'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.temperature}
          onChangeText={text => {updateSingleFlowMeasurement({temperature: parseFloat(text)})}}
          label={'Temperatura'}
        />
        <NumberInputBar
          placeholder=""
          value={currentMeasurement.angle}
          onChangeText={text => {updateSingleFlowMeasurement({angle: text})}}
          label={'Kąt'}
        />
      </ScrollView>
    </View>
  );
};
