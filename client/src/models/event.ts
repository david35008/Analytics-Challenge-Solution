export interface Event {
  _id: string;
  session_id: string;
  name: eventName;
  url: string;
  distinct_user_id: string;
  date: number;
  os: os;
  browser: browser;
  geolocation: GeoLocation;
}

export interface weeklyRetentionObject {
  registrationWeek: number;
  newUsers: number;
  weeklyRetention: number[];
  start: string;
  end: string
}

export type eventName = "login" | "signup" | "admin" | "/";
export type os = "windows" | "mac" | "linux" | "ios" | "android" | "other";
export type browser = "chrome" | "safari" | "edge" | "firefox" | "ie" | "other";
export type GeoLocation = {
  location: Location;
  accuracy: number;
};
export type Location = {
  lat: number;
  lng: number;
};
export interface RetentionCohort {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

export interface SessionsDaysInter {
  date: string;
  count: number;
}

export interface SessionsHoursInter {
  hour: string;
  count: number;
}

export interface ViewsPerPageInter {
  name: string;
  views: number;
}

export interface PieOsInter {
  name: string;
  value: number;
}

export interface ActiveShapeInter {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: { name: string }
  percent: number
  value: number
}

export type CustomizedTablesType = number[] | undefined;