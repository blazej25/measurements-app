class RectangularPipeCalculationEngine {
  height: number;
  width: number;
  constructor(height: number, width: number) {
    this.width = width;
    this.height = height;
  }

  calculateCrossSectionArea() {
    return this.width * this.height;
  }

  /**
   * Based on the selected pipe diameter, we determine the minimum bound
   * for the number of measurement axes and the number of points that are
   * required to take on each axis. The rules are determined by the config
   * above.
   */
  determineMeasurementConstraints(): RectangularPipeMeasurementConstraints {
    const BOUND_1: number = 0.1;
    const BOUND_2: number = 1.0;
    const BOUND_3: number = 2.0;

    const output: RectangularPipeMeasurementConstraints = {
      minimumSectionAlongPipeSideCount: 0,
      minimumMeasurementPointCount: 0,
    };

    const area = this.calculateCrossSectionArea();

    if (area < BOUND_1) {
      output.minimumSectionAlongPipeSideCount = 0;
      output.minimumMeasurementPointCount = 1;
    } else if (BOUND_1 <= area && area < BOUND_2) {
      output.minimumSectionAlongPipeSideCount = 2;
      output.minimumMeasurementPointCount = 4;
    } else if (BOUND_2 <= area && area < BOUND_3) {
      output.minimumSectionAlongPipeSideCount = 3;
      output.minimumMeasurementPointCount = 9;
    } else {
      output.minimumSectionAlongPipeSideCount = 4;
      output.minimumMeasurementPointCount = Math.min(
        Math.max(12, Math.round(4 * this.calculateCrossSectionArea())),
        MAXIMUM_MEASUREMENT_POINT_COUNT,
      );
    }

    // If the height/width or width/height ratio exceeds 2 we need to
    // increase then number of axes / points on each axis to bring that
    // ratio down below 2.

    // Height is considered to be the 'vertical' edge along which axes are laid out
    if (this.height / this.width > 2) {
      output.minimumMeasurementPointCount *= 2;
    }

    // Width is the axis along which we have measurement points
    if (this.width / this.height > 2) {
      output.minimumSectionAlongPipeSideCount *= 2;
    }

    return output;
  }

  findMeasurementPointPositions(pointCount: number, width: number): number[] {
    const sectionWidth = width / pointCount;

    const positions: number[] = [];
    for (let i = 0; i < pointCount; i++) {
      positions.push(sectionWidth * (i + 0.5));
    }
    return positions;
  }
}

type RectangularPipeMeasurementConstraints = {
  // Determines the minimum number of segments into which each side of the
  // rectangular pipe should be divided to determine sub-areas where the points
  // will be located.
  minimumSectionAlongPipeSideCount: number;
  minimumMeasurementPointCount: number;
};

export const MAXIMUM_MEASUREMENT_POINT_COUNT = 20;
export default RectangularPipeCalculationEngine;
