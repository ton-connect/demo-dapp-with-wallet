export type SignDataPayloadText = {
  type: "text";
  text: string;
};

export type SignDataPayloadBinary = {
  type: "binary";
  bytes: string; // base64 (not url safe) encoded bytes array
};

export type SignDataPayloadCell = {
  type: "cell";
  schema: string; // TL-B scheme of the cell payload
  cell: string; // base64 (not url safe) encoded cell
}

export type SignDataPayload = SignDataPayloadText | SignDataPayloadBinary | SignDataPayloadCell;

export interface SignDataParams {
  payload: SignDataPayload;
  domain: string;
  privateKey: Buffer;
  address: string;
}

export interface SignDataResult {
  signature: string; // base64
  address: string;
  timestamp: number;
  domain: string;
  payload: SignDataPayload;
} 