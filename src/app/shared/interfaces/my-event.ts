import { User } from "./user";

export interface MyEventInsert {
  title: string;
  description: string;
  price: number;
  image: string;
  address: string,
  lat: number,
  lng: number,
  distance?: number;
  date: string;
  mine?: boolean;
}

export interface MyEvent extends MyEventInsert {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  date: string;
  numAttend: number;
  attend: boolean;
  mine?: boolean;
  creator?: User;
}
