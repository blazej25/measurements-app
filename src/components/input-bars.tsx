import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
  largeBorderRadius,
  styles,
} from '../styles/common-styles';
import {getDateString, getTimeString} from '../util/date-util';

export const SelectorBar = ({
  label,
  selections,
  onSelect,
  selectionToText,
}: {
  label: string;
  selections: string[];
  onSelect: (selectedItem: string, index: number) => void;
  selectionToText?: (selectedItem: string) => string;
}) => {
  const selectorItemStyle = {
    borderRadius: defaultBorderRadius,
    backgroundColor: colors.secondaryBlue,
    height: 40,
    maxWidth: 130,
  };

  const dropdownStyle = {
    borderRadius: largeBorderRadius,
    padding: defaultGap,
    paddingBottom: 0,
    backgroundColor: colors.buttonBlue,
    // The height of the dropdown needs to include space for all selection items
    // plus the gaps between them
    height:
      selectorItemStyle.height * selections.length +
      defaultGap * (selections.length + 1),
  };
  return (
    <DataBar label={label}>
      <View>
        <SelectDropdown
          buttonStyle={selectorItemStyle}
          rowStyle={selectorItemStyle}
          dropdownStyle={dropdownStyle}
          defaultValue={selections[0]}
          buttonTextStyle={{fontSize: 14}}
          data={selections}
          onSelect={(selectedItem, index) => {
            onSelect(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, _index) => {
            if (selectionToText) {
              return selectionToText(selectedItem);
            }
            return selectedItem;
          }}
          rowTextForSelection={(item, _index) => {
            if (selectionToText) {
              return selectionToText(item);
            }
            return item;
          }}
        />
      </View>
    </DataBar>
  );
};

export const NumberInputBar = ({
  label,
  placeholder,
  valueUnit,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  valueUnit: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <DataBar label={label}>
      <TextInput
        keyboardType={'numeric'}
        placeholderTextColor={'gray'}
        placeholder={placeholder}
        onChangeText={onChangeText}
        textAlign={'right'}
        style={styles.dataSelectorText}
      />
      <Text style={styles.dataSelectorText}>{valueUnit}</Text>
    </DataBar>
  );
};

export const TextInputBar = ({
  label,
  placeholder,
  onChangeText,
}: {
  label: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <DataBar label={label}>
      <TextInput
        placeholderTextColor={'gray'}
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.dataSelectorText}
      />
    </DataBar>
  );
};

export const DataBar = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={{
        borderRadius: largeBorderRadius,
        flexDirection: 'row',
        backgroundColor: colors.buttonBlue,
        marginHorizontal: defaultGap,
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          ...styles.buttonText1,
          alignSelf: 'center',
          margin: defaultGap,
          marginLeft: defaultPadding,
        }}>
        {label}
      </Text>
      <TouchableOpacity
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          backgroundColor: colors.secondaryBlue,
          height: 40,
        }}>
        {children}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const DateTimeSelectorGroup = ({
  dateLabel,
  timeLabel,
  date,
  setDate,
}: {
  dateLabel: string;
  timeLabel: string;
  date: Date;
  setDate: (date: Date) => void;
}) => {
  const [datePickerActive, setDatePickerActive] = useState(false);
  const [timePickerActive, setTimePickerActive] = useState(false);

  return (
    <>
      <DataBar label={dateLabel}>
        <TouchableOpacity
          onPress={() => {
            setDatePickerActive(true);
          }}>
          <Text style={styles.dataSelectorText}>{getDateString(date)}</Text>
          {datePickerActive && (
            <RNDateTimePicker
              mode="date"
              value={date}
              onChange={(
                event: DateTimePickerEvent,
                selectedDate?: Date | undefined,
              ) => {
                if (event.type === 'set' && selectedDate !== undefined) {
                  setDate(selectedDate);
                }
                setDatePickerActive(false);
              }}
            />
          )}
        </TouchableOpacity>
      </DataBar>
      <DataBar label={timeLabel}>
        <TouchableOpacity
          onPress={() => {
            setTimePickerActive(true);
          }}>
          <Text style={styles.dataSelectorText}>{getTimeString(date)}</Text>
          {timePickerActive && (
            <RNDateTimePicker
              mode="time"
              value={date}
              onChange={(
                event: DateTimePickerEvent,
                selectedDate?: Date | undefined,
              ) => {
                if (event.type === 'set' && selectedDate !== undefined) {
                  setDate(selectedDate);
                }
                setTimePickerActive(false);
              }}
            />
          )}
        </TouchableOpacity>
      </DataBar>
    </>
  );
};
