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

// @noble/post-quantum ships its own type definitions (ml-dsa.d.ts) and they are
// authoritative. A hand-written `declare module '@noble/post-quantum/ml-dsa'`
// block used to live here declaring the argument order backwards --
// sign(secretKey, message) and verify(publicKey, message, signature) -- which
// made the compiler accept call sites that throw at runtime. That is how the
// reversed-argument bug survived review.
//
// Do not re-add it. Import from '@noble/post-quantum/ml-dsa.js' (the package
// exports map defines no bare './ml-dsa' subpath) and rely on the real types:
//   sign(message, secretKey)
//   verify(signature, message, publicKey)
