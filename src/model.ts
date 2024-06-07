import {useState} from 'react';

export enum PipeCrossSectionType {
  ROUND = 'ROUND',
  RECTANGULAR = 'RECTANGULAR',
}

export function crossSectionTypeFrom(str: string): PipeCrossSectionType {
  if (str === 'RECTANGULAR') {
    return PipeCrossSectionType.RECTANGULAR;
  }
  return PipeCrossSectionType.RECTANGULAR;
}

export type Person = {
  name: string;
  surname: string;
};

export type HomeScreenInformationData = {
  date: Date;
  measurementRequestor: string;
  emissionSource: string;
  pipeCrossSectionType: PipeCrossSectionType;
  staffResponsibleForMeasurement: Person[];
  temperature: string;
  pressure: string;
};
