import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown';
import {Person} from '../model';

import {
  colors,
  defaultBorderRadius,
  defaultGap,
  defaultPadding,
  largeBorderRadius,
  styles,
} from '../styles/common-styles';
import {getDateString, getTimeString} from '../util/date-util';
import {useTranslation} from 'react-i18next';
import {CommonDataSchema} from '../constants';

export const SelectorBar = ({
  label,
  selections,
  onSelect,
  selectionToText,
  rowTextForSelection,
}: {
  label: string;
  selections: string[];
  onSelect: (selectedItem: string, index: number) => void;
  selectionToText?: (selectedItem: string) => string;
  rowTextForSelection?: (selectedItem: string) => string;
}) => {
  const selectorItemStyle = {
    borderRadius: defaultBorderRadius,
    backgroundColor: colors.secondaryBlue,
    marginBottom: defaultGap,
    height: 40,
    maxWidth: 110,
  };

  const dropdownStyle = {
    borderRadius: largeBorderRadius,
    padding: defaultGap,
    paddingBottom: 0,
    backgroundColor: colors.buttonBlue,
    // The height of the dropdown needs to include space for all selection items
    // plus the gaps between them
    height: Math.min(
      selectorItemStyle.height * selections.length +
        defaultGap * (selections.length + 1),
      400,
    ),
  };
  return (
    <DataBar label={label}>
      <View style={{borderRadius: defaultBorderRadius}}>
        {selections.length != 0 ? (
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
            buttonTextAfterSelection={(item, _index) => {
              return selectionToText ? selectionToText(item) : item;
            }}
            rowTextForSelection={(item, _index) => {
              return rowTextForSelection
                ? rowTextForSelection(item)
                : selectionToText
                ? selectionToText(item)
                : item;
            }}
          />
        ) : (
          // TODO: finish this off so that it handles the no selections empty box
          // properly
          <SelectDropdown
            buttonStyle={selectorItemStyle}
            rowStyle={selectorItemStyle}
            dropdownStyle={dropdownStyle}
            buttonTextStyle={{fontSize: 14}}
            data={['Test']}
            onSelect={() =>
              console.log('Dropdown selected when no selections available')
            }
          />
        )}
      </View>
    </DataBar>
  );
};

export const StaffListInputBar = ({
  label,
  staffList,
  setStaffList,
}: {
  label: string;
  staffList: Person[];
  setStaffList: (staffList: Person[]) => void;
}) => {
  const [addingStaffMember, setAddingStaffMember] = useState(false);
  const [newStaffMemberName, setNewStaffMemberName] = useState('');
  const [isCollapsed, setCollapsed] = useState(false);
  const {t} = useTranslation();
  return (
    <>
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
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              borderRadius: defaultBorderRadius,
              flexDirection: 'row',
              margin: defaultGap,
              paddingHorizontal: defaultPadding,
              backgroundColor: colors.secondaryBlue,
              height: 40,
            }}
            onPress={() => setCollapsed(!isCollapsed)}>
            <Icon
              name={isCollapsed ? 'arrow-collapse-down' : 'arrow-collapse-up'}
              style={{marginTop: 10}}
              size={20}
              color={colors.buttonBlue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: defaultBorderRadius,
              flexDirection: 'row',
              margin: defaultGap,
              paddingHorizontal: defaultPadding,
              backgroundColor: colors.secondaryBlue,
              height: 40,
            }}
            onPress={() => setAddingStaffMember(true)}>
            <Icon
              name="plus"
              style={{marginTop: 10}}
              size={20}
              color={colors.buttonBlue}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {addingStaffMember && (
        <DataBar label={t(`commonDataForm:${CommonDataSchema.nameAndSurname}`)}>
          <TextInput
            placeholderTextColor={'gray'}
            placeholder={'Jan Kowalski'}
            onChangeText={setNewStaffMemberName}
            style={styles.dataSelectorText}
          />
          <TouchableOpacity
            onPress={() => {
              setAddingStaffMember(false);
              const split = newStaffMemberName.split(' ');
              const name = split[0].trim();
              const surname = split[1].trim();
              setStaffList([...staffList, {name: name, surname: surname}]);
              setNewStaffMemberName('');
            }}>
            <Icon
              name="check"
              style={{marginTop: 10}}
              size={20}
              color="green"
            />
          </TouchableOpacity>
        </DataBar>
      )}
      {!isCollapsed &&
        staffList.map((staffMember: Person) => (
          <StaffMemberLog
            staffMember={staffMember}
            staffMembers={staffList}
            setStaffMembers={setStaffList}
            key={staffList.indexOf(staffMember)}
          />
        ))}
    </>
  );
};

const StaffMemberLog = ({
  staffMember,
  staffMembers,
  setStaffMembers,
}: {
  staffMember: Person;
  staffMembers: Person[];
  setStaffMembers: (staffMembers: Person[]) => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={{
        borderRadius: largeBorderRadius,
        flexDirection: 'row',
        backgroundColor: colors.secondaryBlue,
        marginHorizontal: defaultGap,
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        paddingHorizontal: defaultPadding,
        gap: defaultGap,
      }}>
      <TouchableOpacity
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          backgroundColor: colors.secondaryBlue,
          height: 30,
        }}>
        <Text
          style={{
            textAlignVertical: 'center',
            color: 'black',
            fontSize: 14,
          }}>
          {staffMember.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          backgroundColor: colors.secondaryBlue,
          height: 30,
        }}>
        <Text
          style={{
            textAlignVertical: 'center',
            color: 'black',
            fontSize: 14,
          }}>
          {staffMember.surname}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setStaffMembers(
            staffMembers.filter(member => member !== staffMember),
          );
        }}>
        <Icon
          name="delete"
          style={{marginTop: 7, alignSelf: 'center'}}
          size={15}
          color={colors.buttonBlue}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export const NumberInputBar = ({
  value,
  label,
  placeholder,
  valueUnit,
  onChangeText,
}: {
  value?: string;
  label: string;
  placeholder: string;
  valueUnit?: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <DataBar label={label}>
      <TextInput
        keyboardType={'numeric'}
        placeholderTextColor={'gray'}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        textAlign={'right'}
        style={styles.dataSelectorText}
      />
      {valueUnit && <Text style={styles.dataSelectorText}>{valueUnit}</Text>}
    </DataBar>
  );
};

export const TextInputBar = ({
  label,
  value,
  placeholder,
  onChangeText,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <DataBar label={label}>
      <TextInput
        value={value}
        placeholderTextColor={'gray'}
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.dataSelectorText}
      />
    </DataBar>
  );
};

/**
 * DataBar is the basic container component out of which all of the other ui bar
 * selectors / input boxer are built. It takes in the label which is the main title
 * of the input bar and a 'children' property which is responsible for embedding
 * the actual component inside of that horizontal bar.
 */
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
/*
TODO: finish the duration selector.
export const DurationSelector = ({
  timeLabel,
  minutes,
  setMinutes,
}: {
  timeLabel: string;
  minutes: number;
  setMinutes: (minutes: number) => void;
}) => {
  const [timePickerActive, setTimePickerActive] = useState(false);
  return (
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
  );
*/

export const TimeSelector = ({
  timeLabel,
  date,
  setDate,
}: {
  timeLabel: string;
  date: Date;
  setDate: (date: Date) => void;
}) => {
  const [timePickerActive, setTimePickerActive] = useState(false);
  return (
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

export const StartEndBar = ({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) => {
  const {t} = useTranslation();

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
        {t('utilitiesScreen:start')}
      </Text>
      <TouchableOpacity
      activeOpacity={1.0}
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          backgroundColor: colors.secondaryBlue,
          height: 40,
        }}>
        <Text
          style={{
            alignSelf: 'center',
            margin: defaultGap,
            marginLeft: defaultPadding,
            color: 'black'
          }}>
          {start.toLocaleTimeString('EU', {hour: 'numeric', minute: 'numeric'})}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          ...styles.buttonText1,
          alignSelf: 'center',
          margin: defaultGap,
          marginLeft: defaultPadding,
        }}>
        {t('utilitiesScreen:end')}
      </Text>
      <TouchableOpacity
        activeOpacity={1.0}
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          backgroundColor: colors.secondaryBlue,
          height: 40,
        }}>
        <Text
          style={{
            alignSelf: 'center',
            margin: defaultGap,
            marginLeft: defaultPadding,
            color: 'black'
          }}>
          {end.toLocaleTimeString('EU', {hour: 'numeric', minute: 'numeric'})}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const OutputBar = ({
  label,
  output,
}: {
  label: string;
  output: string;
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
      activeOpacity={1.0}
        style={{
          borderRadius: defaultBorderRadius,
          flexDirection: 'row',
          margin: defaultGap,
          paddingHorizontal: defaultPadding,
          backgroundColor: colors.secondaryBlue,
          height: 40,
        }}>
        <Text
          style={{
            alignSelf: 'center',
            margin: defaultGap,
            marginLeft: defaultPadding,
            color: 'black'
          }}>
          {output}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
