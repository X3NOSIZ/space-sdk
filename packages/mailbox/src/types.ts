export enum InvitationStatus {
  PENDING = 0,
  ACCEPTED,
  REJECTED,
}

export interface FullPath {
  dbId: string;
  bucketKey: string;
  bucket: string;
  path: string;
}

export interface Invitation {
  inviterPublicKey: string;
  inviteePublicKey: string;
  invitationID?: string;
  status: InvitationStatus;
  itemPaths: FullPath[];
  keys:Uint8Array[];
}
