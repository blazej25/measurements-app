class CircularPipeCalculationEngine {
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
  determineMeasurementConstraints(): CircularPipeMeasurementConstraints {
    console.log(
      'Calculating the measurement constraints for pipe diameter: ' +
        this.pipeDiameter,
    );
    const BOUND_1: number = 0.35;
    const BOUND_2: number = 1.1;
    const BOUND_3: number = 1.6;

    const output: CircularPipeMeasurementConstraints = {
      minimumMeasurementAxisCount: 0,
      minimumMeasurementPointCount: 0,
    };

    // First determine the number of measurement axes.
    // The logic is a lot simpler here.
    if (this.pipeDiameter < BOUND_1) {
      output.minimumMeasurementAxisCount = 0;
    } else {
      output.minimumMeasurementAxisCount = 2;
    }

    if (this.pipeDiameter < BOUND_1) {
      output.minimumMeasurementPointCount = 1;
    } else if (BOUND_1 <= this.pipeDiameter && this.pipeDiameter <= BOUND_2) {
      output.minimumMeasurementPointCount = 4;
    } else if (BOUND_2 < this.pipeDiameter && this.pipeDiameter <= BOUND_3) {
      output.minimumMeasurementPointCount = 8;
    } else {
      output.minimumMeasurementPointCount = Math.min(
        Math.max(12, Math.round(4 * this.calculatePipeCrossSectionArea())),
        MAXIMUM_MEASUREMENT_POINT_COUNT,
      );
    }

    // Note that in the output we provide the min number of measurement points
    // per axis. Because of this we need to divide
    if (output.minimumMeasurementAxisCount > 0) {
      output.minimumMeasurementPointCount /= output.minimumMeasurementAxisCount;
    }

    console.log(
      'Calculated measurement constraints: ' + JSON.stringify(output),
    );
    return output;
  }

  /**
   * Calculates the positions of the n_d points along the measurement axis.
   */
  findMeasurementPointPositionsBasicMethod(
    measurementPointCount: number,
    measurementAxisCount: number,
  ): number[] {
    const middle_point_index = (measurementPointCount + 1) / 2;
    var positions: number[] = [];
    const radius = this.pipeDiameter / 2;

    // Input parameters are renamed to make the formula concise.
    const n = measurementAxisCount;
    const n_d = measurementPointCount;

    // In both cases of the formula the denominator of the expression under
    // the square root is the same so we extract it out here
    const sqrt_fraction_denom = n * (n_d - 1) + 1;

    // Note that in the measurement point position formula the i referring to
    // the index of the measurement point starts from 1.
    for (let i = 1; i <= measurementPointCount; i++) {
      if (i < middle_point_index) {
        // Case 1: to left of the centre centre of the pipe.
        positions.push(
          radius *
            (1 - Math.sqrt((n * (n_d - 2 * i) + 1) / sqrt_fraction_denom)),
        );
      } else if (i === middle_point_index) {
        // Case 2: at the centre of the pipe.
        positions.push(radius);
      } else {
        // case 3: to the right of the centre of the pipe.
        positions.push(
          radius *
            (1 + Math.sqrt((n * (2 * i - 2 - n_d) + 1) / sqrt_fraction_denom)),
        );
      }
    }
    return positions;
  }

  /**
   * Calculates the positions of the n_d points along the measurement axis using
   * the alternative method that does not include a measurement in the middle
   * of the pipe.
   */
  findMeasurementPointPositionsAlternativeMethod(
    measurementPointCount: number,
    measurementAxisCount: number,
  ): number[] {
    const middle_index = measurementPointCount / 2;
    var positions: number[] = [];
    const radius = this.pipeDiameter / 2;

    // Input parameters are renamed to make the formula concise.
    const n = measurementAxisCount;

    // Note that in the measurement point position formula the i referring to
    // the index of the measurement point starts from 1.
    for (let i = 1; i <= measurementPointCount; i++) {
      if (i <= middle_index) {
        // Case 1: to left of the centre centre of the pipe.
        positions.push(radius * (1 - Math.sqrt(1 - (2 * i - 1) / n)));
      } else {
        // case 3: to the right of the centre of the pipe.
        positions.push(radius * Math.sqrt((2 * i - 1) / n));
      }
    }
    return positions;
  }
}

type CircularPipeMeasurementConstraints = {
  minimumMeasurementAxisCount: number;
  minimumMeasurementPointCount: number;
};

export const MAXIMUM_MEASUREMENT_POINT_COUNT = 20;
export default CircularPipeCalculationEngine;
