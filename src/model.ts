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
  arrivalTime: string;
  measurementRequestor: string;
  emissionSource: string;
  pipeCrossSectionType: PipeCrossSectionType;
  staffResponsibleForMeasurement: Person[];
  temperature: number;
  pressure: number;
};
