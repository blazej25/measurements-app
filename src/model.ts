import {useState} from 'react';

export enum PipeCrossSectionType {
  ROUND = 'ROUND',
  RECTANGULAR = 'RECTANGULAR',
}

export type Person = {
  name: string;
  surname: string;
};

export type CommonMeasurementData = {
  date: Date;
  measurementRequestor: string;
  emissionSource: string;
  pipeCrossSectionType: PipeCrossSectionType;
  staffResponsibleForMeasurement: Person[];
  temperature: number;
  pressure: number;
};

export type CommonMeasurementDataSetters = {
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setMeasurementRequestor: React.Dispatch<React.SetStateAction<string>>;
  setEmissionSource: React.Dispatch<React.SetStateAction<string>>;
  setPipeCrossSectionType: React.Dispatch<
    React.SetStateAction<PipeCrossSectionType>
  >;
  setStaffResponsibleForMeasurement: React.Dispatch<
    React.SetStateAction<Person[]>
  >;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  setPressure: React.Dispatch<React.SetStateAction<number>>;
};
