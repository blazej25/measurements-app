import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { jsonToCSV, readString } from 'react-native-csv';
import { useTranslation } from 'react-i18next';
import { NavigationButton } from '../components/buttons';
import { CommonDataSchema, Screens } from '../constants';
import { colors, styles } from '../styles/common-styles';
import {
  DateTimeSelectorGroup,
  NumberInputBar,
  SelectorBar,
  StaffListInputBar,
  TextInputBar,
} from '../components/input-bars';
import {
  HomeScreenInformationData,
  Person,
  PipeCrossSectionType,
  crossSectionTypeFrom,
} from '../model';
import { LoadDeleteSaveGroup } from '../components/LoadDeleteSaveGroup';
import { HelpAndSettingsGroup } from '../components/HelpAndSettingsGroup';
import FileSystemService from '../services/FileSystemService';

export const HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME = 'home.txt';
export const HOME_SCREEN_CSV_HEADING = 'Strona główna\n'
export const PERSONNEL_CSV_HEADING = 'Personel\n'

interface InformationCSVRow {
  'Data': string,
  'Zleceniodawca': string,
  'Źródło emisji': string,
  'Rodzaj przewodu': string,
  'Temperatura': string,
  'Ciśnienie': string
}

interface PersonnelCSVRow {
  'Imię': string,
  'Nazwisko': string
}

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const fileSystemService = new FileSystemService();

  const empty_data: HomeScreenInformationData = {
    date: new Date(),
    measurementRequestor: '',
    emissionSource: '',
    pipeCrossSectionType: PipeCrossSectionType.ROUND,
    staffResponsibleForMeasurement: [],
    temperature: '',
    pressure: '',
  };

  const [measurementData, setMeasurementData] = useState(empty_data);

  /* Logic for persisting state in the internal storage. */
  // See H20_14790_Screen for comments on how this works.
  const loadMeasurements = () => {
    fileSystemService
      .loadJSONFromInternalStorage(HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME)
      .then(loadedMeasurements => {
        restoreStateFrom(loadedMeasurements);
      });
  };

  const restoreStateFrom = (loadedMeasurements: Object) => {
    var data = loadedMeasurements as HomeScreenInformationData;

    if (!data) {
      return;
    }

    data.date = new Date(data.date);
    data.pipeCrossSectionType =
      data.pipeCrossSectionType === 'ROUND'
        ? PipeCrossSectionType.ROUND
        : PipeCrossSectionType.RECTANGULAR;

    setMeasurementData(data);
  };

  const resetState = () => {
    setMeasurementData({ ...empty_data })
    fileSystemService.saveObjectToInternalStorage(
      {...empty_data},
      HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME,
    );
  };


  const restoreStateFromCSV = (fileContents: string) => {
    // The state is stored in two parts of a csv file.
    // The first part contains the general common data whereas the
    // second one contains the list of personnel that carried out the
    // measurement.

    console.log('Restoring state from a CSV file: ');
    console.log(fileContents);
    // First we remove the section header from the file.
    let [data, personnel] = fileContents.split(PERSONNEL_CSV_HEADING);

    const [_, measurementData] = data.split(HOME_SCREEN_CSV_HEADING);
    const rows = readString(measurementData, { header: true })[
      'data'
    ] as InformationCSVRow[];

    const mapPipeCrossSectionType = (type: string) => {
      return type === 'Okrągły'
        ? PipeCrossSectionType.ROUND
        : PipeCrossSectionType.RECTANGULAR;
    }

    const personnelRows = readString(personnel, { header: true })[
      'data'
    ] as PersonnelCSVRow[];


    const personnelData: Person[] = []
    for (const person of personnelRows) {
      personnelData.push({ name: person['Imię'], surname: person['Nazwisko'] });
    }


    const restoredData: HomeScreenInformationData = {
      date: new Date(rows[0]['Data']),
      measurementRequestor: rows[0]['Zleceniodawca'],
      emissionSource: rows[0]['Źródło emisji'],
      pipeCrossSectionType: mapPipeCrossSectionType(rows[0]['Rodzaj przewodu']),
      staffResponsibleForMeasurement: personnelData,
      temperature: rows[0]['Temperatura'],
      pressure: rows[0]['Ciśnienie'],
    }

    setMeasurementData(restoredData);
  }

  useEffect(loadMeasurements, []);

  return (
    <View style={styles.mainContainer}>
      <LoadDeleteSaveGroup
        onDelete={resetState}
        reloadScreen={loadMeasurements}
      />
      <ScrollView contentContainerStyle={styles.defaultScrollView}>
        <WelcomeHeader />
        <CommonDataInput data={measurementData} setter={setMeasurementData} />
        <UtilitiesNavigation navigation={navigation} />
      </ScrollView>
      <HelpAndSettingsGroup navigation={navigation} isHome />
    </View>
  );
};


const WelcomeHeader = () => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 15,
      }}>
      <Text
        style={{ fontSize: 22, fontWeight: 'bold', color: colors.buttonBlue }}>
        {t('userInterface:welcome')}
      </Text>
    </View>
  );
};

const CommonDataInput = ({
  data,
  setter,
}: {
  data: HomeScreenInformationData;
  setter: React.Dispatch<React.SetStateAction<HomeScreenInformationData>>;
}) => {
  const fileSystemService = new FileSystemService();
  const { t } = useTranslation();

  const persistStateInInternalStorage = (state: HomeScreenInformationData) => {
    fileSystemService.saveObjectToInternalStorage(
      state,
      HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME,
    );
  };


  const updateField = (field: any) => {
    const newData = {
      ...data,
      ...field,
    };
    setter(newData);
    persistStateInInternalStorage(newData);
  };
  return (
    <View>
      <ScrollView
        contentContainerStyle={{ ...styles.defaultScrollView, margin: 0 }}>
        <DateTimeSelectorGroup
          date={data.date}
          setDate={date => updateField({ date: date })}
          dateLabel={t(`commonDataForm:${CommonDataSchema.date}`) + ':'}
          timeLabel={t(`commonDataForm:${CommonDataSchema.arrivalTime}`) + ':'}
        />
        <TextInputBar
          value={data.measurementRequestor}
          placeholder={t(`commonDataForm:dummyName`)}
          onChangeText={requestor =>
            updateField({ measurementRequestor: requestor })
          }
          label={
            t(`commonDataForm:${CommonDataSchema.measurementRequestor}`) + ':'
          }
        />
        <TextInputBar
          value={data.emissionSource}
          placeholder={t(`commonDataForm:${CommonDataSchema.emissionSource}`)}
          onChangeText={source => updateField({ emissionSource: source })}
          label={t(`commonDataForm:${CommonDataSchema.emissionSource}`) + ':'}
        />
        <SelectorBar
          label={
            t(`commonDataForm:${CommonDataSchema.pipeCrossSectionType}`) + ':'
          }
          selections={Object.keys(PipeCrossSectionType).map(item =>
            item.toString(),
          )}
          onSelect={(selectedItem: string, _index: number) => {
            updateField({
              pipeCrossSectionType: crossSectionTypeFrom(selectedItem),
            });
          }}
          selectionToText={selection => t(`pipeCrossSectionTypes:${selection}`)}
        />
        <StaffListInputBar
          label={
            t(
              `commonDataForm:${CommonDataSchema.staffResponsibleForMeasurement}`,
            ) + ':'
          }
          staffList={data.staffResponsibleForMeasurement}
          setStaffList={staffList =>
            updateField({ staffResponsibleForMeasurement: staffList })
          }
        />
        <NumberInputBar
          placeholder="20"
          valueUnit="℃"
          value={data.temperature}
          onChangeText={text => updateField({ temperature: text })}
          label={t(`commonDataForm:${CommonDataSchema.temperature}`) + ':'}
        />
        <NumberInputBar
          placeholder="1100"
          valueUnit="hPa"
          value={data.pressure}
          onChangeText={text => updateField({ pressure: text })}
          label={t(`commonDataForm:${CommonDataSchema.pressure}`) + ':'}
        />
      </ScrollView>
    </View>
  );
};

const UtilitiesNavigation = ({ navigation }: { navigation: any }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
      }}>
      <NavigationButton
        navigation={navigation}
        destinationScreen={Screens.utilities}
      />
    </View>
  );
};

export const exportMeasurementsAsCSV = (data: HomeScreenInformationData) => {
  console.log("Starting CSV generation for HomeScreen main information...")
  const csvRows: InformationCSVRow[] = [];
  csvRows.push({
    'Data': data.date.toString(),
    'Zleceniodawca': data.measurementRequestor.trim(),
    'Źródło emisji': data.emissionSource.trim(),
    'Rodzaj przewodu': data.pipeCrossSectionType == PipeCrossSectionType.ROUND ? 'Okrągły' : 'Prostokątny',
    'Temperatura': data.temperature.trim(),
    'Ciśnienie': data.pressure.trim()
  })

  const csvFileContents = HOME_SCREEN_CSV_HEADING + jsonToCSV(csvRows);
  console.log('Exporting a CSV file: ');
  console.log(csvFileContents);
  console.log("CSV contents for Home Screen created successfully.")
  return csvFileContents;
};

export const exportPersonnelAsCSV = (personnel: Person[]) => {
  const csvRows: PersonnelCSVRow[] = [];
  for (const person of personnel) {
    csvRows.push({
      'Imię': person.name.trim(),
      'Nazwisko': person.surname.trim()
    })
  };

  const csvFileContents = PERSONNEL_CSV_HEADING + jsonToCSV(csvRows);
  console.log(csvFileContents);
  return csvFileContents;
}

export const restoreStateFromCSV = (fileContents: string) => {
  // The state is stored in two parts of a csv file.
  // The first part contains the general common data whereas the
  // second one contains the list of personnel that carried out the
  // measurement.

  console.log('Restoring state from a CSV file: ');
  console.log(fileContents);
  // First we remove the section header from the file.
  let [data, personnel] = fileContents.split(PERSONNEL_CSV_HEADING);

  const [_, measurementData] = data.split(HOME_SCREEN_CSV_HEADING);
  const rows = readString(measurementData, { header: true })[
    'data'
  ] as InformationCSVRow[];

  const mapPipeCrossSectionType = (type: string) => {
    return type === 'Okrągły'
      ? PipeCrossSectionType.ROUND
      : PipeCrossSectionType.RECTANGULAR;
  }

  const personnelRows = readString(personnel, { header: true })[
    'data'
  ] as PersonnelCSVRow[];


  const personnelData: Person[] = []
  for (const person of personnelRows) {
    personnelData.push({ name: person['Imię'], surname: person['Nazwisko'] });
  }


  const restoredData: HomeScreenInformationData = {
    date: new Date(rows[0]['Data']),
    measurementRequestor: rows[0]['Zleceniodawca'].trim(),
    emissionSource: rows[0]['Źródło emisji'].trim(),
    pipeCrossSectionType: mapPipeCrossSectionType(rows[0]['Rodzaj przewodu']),
    staffResponsibleForMeasurement: personnelData,
    temperature: rows[0]['Temperatura'].trim(),
    pressure: rows[0]['Ciśnienie'].trim(),
  }

  return restoredData
}