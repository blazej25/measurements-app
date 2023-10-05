import {useMemo, useState} from 'react';

import {Person, PipeCrossSectionType} from './model';

function useCommonDataState(): CommonMeasurementData {
  const [date, setDate] = useState(new Date());
  const [measurementRequestor, setMeasurementRequestor] = useState('');
  const [emissionSource, setEmissionSource] = useState('');
  const [pipeCrossSectionType, setPipeCrossSectionType] = useState(
    PipeCrossSectionType.ROUND,
  );
  const emptyPersonArray: Person[] = [];
  const [staffResponsibleForMeasurement, setStaffResponsibleForMeasurement]: [
    Person[],
    React.Dispatch<React.SetStateAction<Person[]>>,
  ] = useState(emptyPersonArray);
  const [temperature, setTemperature] = useState(0);
  const [pressure, setPressure] = useState(0);

  return {
    date: date,
    measurementRequestor: measurementRequestor,
    emissionSource: emissionSource,
    pipeCrossSectionType: pipeCrossSectionType,
    staffResponsibleForMeasurement: staffResponsibleForMeasurement,
    temperature: temperature,
    pressure: pressure,
  };
}
