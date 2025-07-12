export interface FlightRow {
  num_vol: string;
  depart: string;
  arrivee: string;
  imma: string;
  sd_loc: string;
  sa_loc: string;
  /**
   * Number of J class seats. Defaults to 0 when a row is created.
   */
  j_class: number;
  /**
   * Number of Y class seats. Defaults to 0 when a row is created.
   */
  y_class: number;
}
