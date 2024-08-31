export interface IListData {
  hasNextPage: boolean,
  total: number,
  hidden: number,
}

export interface IPlace {
  name: string;
  latitude: number;
  longitude: number;
}