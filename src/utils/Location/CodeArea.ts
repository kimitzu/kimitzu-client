/**
 * https://github.com/tspoke/typescript-open-location-code
 * by Thibaud Giovannetti
 */

const LATITUDE_MAX = 90
const LONGITUDE_MAX = 180

/**
 * Coordinates of a decoded Open Location Code.
 *
 * The coordinates include the latitude and longitude of the lower left and
 * upper right corners and the center of the bounding box for the area the
 * code represents.
 *
 * @constructor
 */
export class CodeArea {
  /**
   * The latitude of the center in degrees.
   */
  public latitudeCenter: number
  /**
   * The longitude of the center in degrees.
   */
  public longitudeCenter: number

  constructor(
    public latitudeLo: number,
    public longitudeLo: number,
    public latitudeHi: number,
    public longitudeHi: number,
    public codeLength: number
  ) {
    this.latitudeCenter = Math.min(latitudeLo + (latitudeHi - latitudeLo) / 2, LATITUDE_MAX)
    this.longitudeCenter = Math.min(longitudeLo + (longitudeHi - longitudeLo) / 2, LONGITUDE_MAX)
  }

  public getLatitudeHeight(): number {
    return this.latitudeHi - this.latitudeLo
  }

  public getLongitudeWidth(): number {
    return this.longitudeHi - this.longitudeLo
  }
}
