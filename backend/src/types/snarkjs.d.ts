/**
 * Type Definitions — Snarkjs D
 *
 * TypeScript type definitions and interfaces.
 * @module types/snarkjs.d
 */

declare module 'snarkjs' {
  export namespace groth16 {
    function fullProve(input: any, wasmFile: string, zkeyFile: string): Promise<{ proof: any; publicSignals: string[] }>;
    function prove(zkeyFile: string, wtnsFile: string): Promise<{ proof: any; publicSignals: string[] }>;
    function verify(vKey: any, publicSignals: string[], proof: any): Promise<boolean>;
    function exportSolidityCallData(proof: any, publicSignals: string[]): Promise<string>;
  }

  export namespace plonk {
    function fullProve(input: any, wasmFile: string, zkeyFile: string): Promise<{ proof: any; publicSignals: string[] }>;
    function prove(zkeyFile: string, wtnsFile: string): Promise<{ proof: any; publicSignals: string[] }>;
    function verify(vKey: any, publicSignals: string[], proof: any): Promise<boolean>;
  }

  export namespace fflonk {
    function fullProve(input: any, wasmFile: string, zkeyFile: string): Promise<{ proof: any; publicSignals: string[] }>;
    function prove(zkeyFile: string, wtnsFile: string): Promise<{ proof: any; publicSignals: string[] }>;
    function verify(vKey: any, publicSignals: string[], proof: any): Promise<boolean>;
  }

  export namespace powersOfTau {
    function newAccumulator(curve: any, power: number, ptauFile: string): Promise<void>;
    function contribute(ptauOld: string, ptauNew: string, name: string, entropy: string): Promise<void>;
    function preparePhase2(ptauOld: string, ptauNew: string): Promise<void>;
    function beacon(ptauOld: string, ptauNew: string, name: string, beaconHash: string, numIterations: number): Promise<void>;
    function verify(ptauFile: string): Promise<boolean>;
    function exportJson(ptauFile: string): Promise<any>;
    function convert(ptauOld: string, ptauNew: string): Promise<void>;
    function truncate(ptauOld: string, ptauNew: string): Promise<void>;
    function exportChallenge(ptauFile: string, challengeFile: string): Promise<void>;
    function importResponse(ptauOld: string, responseFile: string, ptauNew: string, name: string): Promise<void>;
    function challengeContribute(curve: any, challengeFile: string, responseFile: string, name: string, entropy: string): Promise<void>;
  }

  export namespace r1cs {
    function info(r1csFile: string, logger?: any): Promise<any>;
    function print(r1csFile: string, symFile: string, logger?: any): Promise<void>;
    function exportJson(r1csFile: string): Promise<any>;
  }

  export namespace zKey {
    function newZKey(r1csFile: string, ptauFile: string, zkeyFile: string): Promise<void>;
    function contribute(zkeyOld: string, zkeyNew: string, name: string, entropy: string): Promise<void>;
    function beacon(zkeyOld: string, zkeyNew: string, name: string, beaconHash: string, numIterations: number): Promise<void>;
    function exportVerificationKey(zkeyFile: string): Promise<any>;
    function exportJson(zkeyFile: string): Promise<any>;
    function exportSolidityVerifier(zkeyFile: string): Promise<string>;
    function verifyFromR1cs(r1csFile: string, ptauFile: string, zkeyFile: string): Promise<boolean>;
    function verifyFromInit(initZkeyFile: string, ptauFile: string, zkeyFile: string): Promise<boolean>;
    function exportBellman(zkeyFile: string, bellmanFile: string): Promise<void>;
    function importBellman(zkeyOld: string, bellmanFile: string, zkeyNew: string, name: string): Promise<void>;
    function bellmanContribute(curve: any, challengeFile: string, responseFile: string, name: string, entropy: string): Promise<void>;
  }

  export namespace wtns {
    function calculate(input: any, wasmFile: string, wtnsFile: string): Promise<void>;
    function check(r1csFile: string, wtnsFile: string): Promise<boolean>;
    function exportJson(wtnsFile: string): Promise<any>;
    function debug(input: any, wasmFile: string, wtnsFile: string, symFile: string, logger?: any): Promise<void>;
  }

  export namespace curves {
    function getCurveFromName(name: string): Promise<any>;
  }
}
