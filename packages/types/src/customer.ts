export interface ICustomer {
  id:                string;
  userId:            string | null;
  fullName:          string;
  email:             string | null;
  phone:             string;
  altPhone:          string | null;
  physicalAddress:   string | null;
  city:              string | null;
  country:           string;
  idType:            string;
  idNumber:          string | null;
  idDocumentUrl:     string | null;
  driversLicenceUrl: string | null;
  driversLicenceNo:  string | null;
  isBlacklisted:     boolean;
  blacklistReason:   string | null;
  blacklistedAt:     string | null;
  notes:             string | null;
  createdAt:         string;
  updatedAt:         string;
}