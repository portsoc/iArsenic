import { EstimatorOutput } from '../models/model5-estimator';

/* eslint-disable camelcase */

export interface Well {
  arsenic: number,
  depth: number,
}

export interface Region {
  wells: Well[],
  name: string,
  nearbyRegions?: {distance: number, region: Region}[],
}

export interface Upazila<T> {
  unions: {
    [index: string]: T,
  },
}

export interface District<T> {
  upazilas: {
    [index: string]: T & Upazila<T>,
  },
}

export interface Division<T> {
  districts: {
    [index: string]: T & District<T>,
  },
}

export interface BasicDataSet<T> {
  [index: string]: T & Division<T>,
}

export interface RegionWithStrata {
  s15: number[],
  s45: number[],
  s65: number[],
  s90: number[],
  s150: number[],
  sD: number[],
  s15Wider?: number[],
  s45Wider?: number[],
  s65Wider?: number[],
  s90Wider?: number[],
  s150Wider?: number[],
  sDWider?: number[],
  s15WideningRequired?: {distance: number, count: number},
  s45WideningRequired?: {distance: number, count: number},
  s65WideningRequired?: {distance: number, count: number},
  s90WideningRequired?: {distance: number, count: number},
  s150WideningRequired?: {distance: number, count: number},
  sDWideningRequired?: {distance: number, count: number},
}

export interface ArsenicValues {
  m: number,
  l: number,
  u: number,
}

export interface StatsHierarchyObj {
  [index: string]: ArsenicValues | StatsHierarchyObj,
}


// This interface represents the median/max/lower bound/upper bound
// of arsenic values for each stratum
export interface RegionStatistics {
  s15_med: number,
  s15_max: number,
  s15_low: number,
  s15_upp: number,

  s45_med: number,
  s45_max: number,
  s45_low: number,
  s45_upp: number,

  s65_med: number,
  s65_max: number,
  s65_low: number,
  s65_upp: number,

  s90_med: number,
  s90_max: number,
  s90_low: number,
  s90_upp: number,

  s150_med: number,
  s150_max: number,
  s150_low: number,
  s150_upp: number,

  sD_med: number,
  sD_max: number,
  sD_low: number,
  sD_upp: number,
}

export interface Centroid {
  div: string,
  dis: string,
  upa: string,
  uni: string,
  centroid: [number, number],
}

export interface GeoRegion extends Centroid {
  nearbyRegions: {distance: number, region: Region}[],
  divisionsObj: Region,
}

export type EstimatorFunction = (
  divisions: StatsHierarchyObj,
  div: string,
  dis: string,
  upa: string,
  uni: string,
  depth: number,
  colour: string,
  utensil: string,
  flooding?: string
)=> EstimatorOutput;
