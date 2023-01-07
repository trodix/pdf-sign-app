export interface ITask {
  taskId: string;
  documentList: IDocument[];
  initiator: User;
  taskRecipientList: User[];
  dueDate: Date;
  signTaskStatus: string;
  createdAt: Date;
}

export interface User {
  email: string;
}

export interface IDocument {
  documentId: string;
  originalFileName: string;
  downloaded: boolean;
}

export interface CreateTaskRequest {
  documentList: File[];
  recipientList: string[];
  dueDate: Date;
}

export interface SignTaskRequest {
  reason: string;
  location: string;
  p12Password: string;
  cert: File
}

export interface SignTaskResponse {
  documentId: string;
  originalFileName: string;
  signatureHistory: SignatureHistory[];
}

export interface SignatureHistory {
  signedBy: User;
  signedAt: Date;
}

export enum SignTaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SIGNED = "SIGNED",
  DOWNLOADED = "DOWNLOADED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}
