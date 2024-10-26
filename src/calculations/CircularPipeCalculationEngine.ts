class FileSystemService {
  pipeDiameter: number;
  constructor(pipeDiameter: number) {
    this.pipeDiameter = pipeDiameter;
  }

  calculatePipeCrossSectionArea() {
    return Math.PI * Math.pow(this.pipeDiameter / 2, 2);
  }

  /**
   * Based on the selected pipe diameter, we determine the minimum bound
   * for the number of measurement axes and the number of points that are
   * required to take on each axis. The rules are determined by the config
   * above.
   */
  determineMeasurementConstraints(): MeasurementConstraints {
    const BOUND_1: number = 0.35;
    const BOUND_2: number = 1.1;
    const BOUND_3: number = 1.6;

    const output: MeasurementConstraints = {
      minimumMeasurementAxisCount: 0,
      minimumMeasurementPointCount: 0,
    };

    // First determine the number of measurement axes.
    // The logic is a lot simpler here.
    if (this.pipeDiameter < BOUND_1) {
      output.minimumMeasurementAxisCount = 0;
    } else {
      output.minimumMeasurementAxisCount = 0;
    }

    if (this.pipeDiameter < BOUND_1) {
      output.minimumMeasurementPointCount = 1;
    } else if (BOUND_1 <= this.pipeDiameter && this.pipeDiameter < BOUND_2) {
      output.minimumMeasurementPointCount = 4;
    } else if (BOUND_2 <= this.pipeDiameter && this.pipeDiameter < BOUND_3) {
      output.minimumMeasurementPointCount = 8;
    } else {
      output.minimumMeasurementPointCount = Math.min(
        Math.max(12, Math.round(4 * this.calculatePipeCrossSectionArea())),
        MAXIMUM_MEASUREMENT_POINT_COUNT,
      );
    }

    return output;
  }
}

type MeasurementConstraints = {
  minimumMeasurementAxisCount: number;
  minimumMeasurementPointCount: number;
};

export const MAXIMUM_MEASUREMENT_POINT_COUNT = 20;
export default FileSystemService;
