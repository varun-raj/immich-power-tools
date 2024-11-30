export interface IAlbum {
  albumName:                  string;
  description:                string;
  albumThumbnailAssetId:      string;
  createdAt:                  Date;
  updatedAt:                  Date;
  id:                         string;
  ownerId:                    string;
  owner:                      IAlbumOwner;
  albumUsers:                 any[];
  shared:                     boolean;
  hasSharedLink:              boolean;
  startDate:                  Date;
  endDate:                    Date;
  assets:                     any[];
  assetCount:                 number;
  isActivityEnabled:          boolean;
  order:                      string;
  lastModifiedAssetTimestamp: Date;
  firstPhotoDate:             Date;
  lastPhotoDate:              Date;
  faceCount:                  number;
}

export interface IAlbumOwner {
  id:               string;
  email:            string;
  name:             string;
  profileImagePath: string;
  avatarColor:      string;
}

export interface IAlbumCreate {
  albumName: string;
  assetIds?: string[];
  albumUsers?: {
    role: string;
    userId: string;
  }[];
}