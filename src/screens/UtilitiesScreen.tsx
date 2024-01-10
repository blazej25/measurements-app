import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {CommonDataSchema, Screens} from '../constants';
import {
  DateTimeSelectorGroup,
  NumberInputBar,
  TimeSelector,
  StartEndBar,
} from '../components/input-bars';
import {useTranslation} from 'react-i18next';
import {styles} from '../styles/common-styles';
import {LoadDeleteSaveGroup} from '../components/LoadDeleteSaveGroup';
import {HelpAndSettingsGroup} from '../components/HelpAndSettingsGroup';
import {ButtonIcon} from '../components/ButtonIcon';

interface SingleMeasurement {
  startingHour: Date;
  endingHour: Date;
  key: number;
}

export const UtilitiesScreen = ({navigation}: {navigation: any}) => {
  const [date, setDate] = useState(new Date());
  const [measurementDuration, setMeasurementDuration] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [startingHour, setStartingHour] = useState(new Date());

  const toNewTime = (date: Date, time: number) => {
    const newTime = new Date();
    newTime.setTime(date.getTime() + time * 60 * 1000);
    return newTime;
  };

  const [times, setTimes] = useState([] as SingleMeasurement[]);

  const {t} = useTranslation();

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        getSavedFileContents={() => ''}
        onDelete={() => {}}
        fileContentsHandler={() => {}}
      />
      <DateTimeSelectorGroup
        date={date}
        setDate={date => {
          setDate(date);
        }}
        dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
        timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
      />
      <NumberInputBar
        placeholder="60"
        valueUnit="min"
        value={measurementDuration.toString()}
        onChangeText={text => {
          text == ''
            ? setMeasurementDuration(0)
            : setMeasurementDuration(parseInt(text));
        }}
        label={t('utilitiesScreen:measurementDuration') + ':'}
      />
      <NumberInputBar
        placeholder="15"
        valueUnit="min"
        value={breakTime.toString()}
        onChangeText={text => {
          text == '' ? setBreakTime(0) : setBreakTime(parseInt(text));
        }}
        label={t('utilitiesScreen:breakTime') + ':'}
      />
      <TimeSelector
        timeLabel={t('utilitiesScreen:startingHour') + ':'}
        date={startingHour}
        setDate={date => {
          setStartingHour(date);
          /* If the user changes the starting hour, then we need to flush the list of measurement logs
           * because the new starting time makes all of the current measurement logs incorrect.
           * In case of other setters (break time, measurement duration), we don't flush the list
           * as those settings could have changed throu
           */
          setTimes([]);
        }}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => {
            if (times.length !== 0) {
              // We need to use slice as mutating state constants in react is discouraged.
              // The reason we do this is that if we just mutate the state, the react
              // library has no idea that the object has changed and therefore
              // no rerender of the ui will get triggered and the screen won't update.
              setTimes(times.slice(0, times.length - 1));
            }
          }}
          style={styles.secondaryNavigationButton}>
          <ButtonIcon materialIconName="minus" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            var newTimes = times;
            if (times.length == 0) {
              const firstTime: SingleMeasurement = {
                startingHour: startingHour,
                endingHour: toNewTime(startingHour, measurementDuration),
                key: 0,
              };
              newTimes = [firstTime];
            } else {
              const mostRecent = times[times.length - 1];
              const newStartTime = toNewTime(mostRecent.endingHour, breakTime);
              const newEndTime = toNewTime(newStartTime, measurementDuration);
              const newKey = mostRecent.key + 1;
              newTimes = times.concat([
                {
                  startingHour: newStartTime,
                  endingHour: newEndTime,
                  key: newKey,
                },
              ]);
            }
            setTimes(newTimes);
          }}
          style={styles.secondaryNavigationButton}>
          <ButtonIcon materialIconName="plus" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{...styles.defaultScrollView, margin: 5, marginHorizontal: 35}}>
        {times.map((x: SingleMeasurement) => {
          return (
            <StartEndBar
              key={x.key}
              start={x.startingHour}
              end={x.endingHour}
            />
          );
        })}
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} />
    </View>
  );
};
