export interface ApiResponse<T> {
  data:    T;
  message: string;
  success: boolean;
}
export interface PaginatedResponse<T> {
  data:       T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}
export interface ICurrency {
  id:        string;
  code:      string;
  name:      string;
  symbol:    string;
  rateToZmw: number;
  isBase:    boolean;
  isActive:  boolean;
  updatedAt: string;
}
export interface ISystemSettings {
  id:              string;
  companyName:     string;
  companyEmail:    string;
  companyPhone:    string;
  companyAddress:  string;
  companyCity:     string;
  logoUrl:         string | null;
  defaultCurrency: string;
  lateFeeRate:     number;
  vatRate:         number;
  whatsappEnabled: boolean;
  emailEnabled:    boolean;
}