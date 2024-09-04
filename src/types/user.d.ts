export interface IUser {
  id:                   string;
  email:                string;
  name:                 string;
  profileImagePath:     string;
  avatarColor:          string;
  storageLabel:         string;
  shouldChangePassword: boolean;
  isAdmin:              boolean;
  createdAt:            Date;
  deletedAt:            null;
  updatedAt:            Date;
  oauthId:              string;
  quotaSizeInBytes:     null;
  quotaUsageInBytes:    number;
  status:               string;
  license:              null;
  isUsingAPIKey?:       boolean;
  accessToken?:         string;
}
