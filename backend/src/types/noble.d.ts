// Type declarations for @noble packages used in crypto services

declare module '@noble/curves/ed25519' {
  export const ed25519: {
    getPublicKey(privateKey: Uint8Array): Uint8Array;
    sign(message: Uint8Array, privateKey: Uint8Array): Uint8Array;
    verify(signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): boolean;
    utils: {
      randomPrivateKey(): Uint8Array;
    };
  };

  export class RistrettoPoint {
    static BASE: RistrettoPoint;
    static ZERO: RistrettoPoint;
    static fromHex(hex: string | Uint8Array): RistrettoPoint;
    static hashToCurve(msg: Uint8Array): RistrettoPoint;
    toRawBytes(): Uint8Array;
    toHex(): string;
    add(other: RistrettoPoint): RistrettoPoint;
    subtract(other: RistrettoPoint): RistrettoPoint;
    multiply(scalar: bigint): RistrettoPoint;
    equals(other: RistrettoPoint): boolean;
  }
}

declare module '@noble/post-quantum/ml-dsa' {
  export const ml_dsa65: {
    keygen(seed?: Uint8Array): { publicKey: Uint8Array; secretKey: Uint8Array };
    sign(secretKey: Uint8Array, message: Uint8Array): Uint8Array;
    verify(publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array): boolean;
  };
}
