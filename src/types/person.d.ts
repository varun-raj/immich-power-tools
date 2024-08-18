export interface IPerson {
  id:            string;
  name:          string;
  birthDate:     Date | null;
  thumbnailPath: string;
  isHidden:      boolean;
  updatedAt:     Date;
  
}

interface IPeopleListResponse extends IListData{
  people: IPerson[]
  total: number
}