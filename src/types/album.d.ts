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
}

export interface IAlbumOwner {
  id:               string;
  email:            string;
  name:             string;
  profileImagePath: string;
  avatarColor:      string;
}
