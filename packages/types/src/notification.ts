import { NotificationType } from './enums';

export interface INotification {
  id:            string;
  userId:        string;
  type:          NotificationType;
  title:         string;
  message:       string;
  referenceId:   string | null;
  referenceType: string | null;
  isRead:        boolean;
  readAt:        string | null;
  createdAt:     string;
}