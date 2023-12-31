export const Screens = {
  home: 'home',
  measurements: 'measurements',
  flows: 'flows',
  aspiration: 'aspiration',
  dust: 'dust',
  H2O: 'H2O',
  gasAnalyzerCheck: 'gasAnalyzerCheck',
  utilities: 'utilities',
  equipmentBase: 'equipmentBase',
  language: 'language',
};

export const CommonDataSchema = {
  date: 'date',
  arrivalTime: 'arrivalTime',
  measurementRequestor: 'measurementRequestor',
  emissionSource: 'emissionSource',
  pipeCrossSectionType: 'pipeCrossSectionType',
  staffResponsibleForMeasurement: 'staffResponsibleForMeasurement',
  nameAndSurname: 'nameAndSurname',
  temperature: 'temperature',
  pressure: 'pressure',
};

export const DustMeasurementDataSchema = {
  measurementNumber: 'measurementNumber',
  numberOfMeasurements: 'numberOfMeasurements',
  selectedEndDiameter: 'selectedEndDiameter',
  measurementStartTime: 'measurementStartTime',
  aspirationTime: 'aspirationTime',
  aspiratedVolume: 'aspiratedVolume',
  filterType: 'filterType',
  water: 'water',
};

export const AspirationDataSchema = {
  date: 'date',
  arrivalTime: 'arrivalTime',
  measurementNumber: 'measurementNumber',
  compoundName: 'compoundName',
  leakTightnessTest: 'leakTightnessTest',
  aspiratorFlow: 'aspiratorFlow',
  aspiratedVolume: 'aspiratedVolume',
  initialVolume: 'initialVolume',
  testNumber: 'testNumber',
  sampleId: 'sampleId',
  compoundType: 'compoundType',
};
