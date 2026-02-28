// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// POST-QUANTUM CRYPTOGRAPHY PAGE
// CendiaPostQuantumKMS™ - Quantum-Resistant Cryptographic Signatures
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import {
  Shield,
  Key,
  Lock,
  Zap,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Info,
  Loader2,
  FileKey,
  Activity,
  BarChart3,
  Clock,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type PQAlgorithm = 
  | 'dilithium2' 
  | 'dilithium3' 
  | 'dilithium5'
  | 'sphincs-shake-128f'
  | 'sphincs-shake-256f'
  | 'falcon-512'
  | 'falcon-1024'
  | 'hybrid-rsa-dilithium';

interface PQKeyPair {
  id: string;
  algorithm: PQAlgorithm;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  rotatedAt?: Date;
  expiresAt: Date;
  strength: 'standard' | 'high' | 'paranoid';
  nistLevel: 1 | 2 | 3 | 5;
}

interface AlgorithmSpec {
  algorithm: PQAlgorithm;
  nistLevel: number;
  signatureSize: number;
  publicKeySize: number;
  privateKeySize: number;
  description: string;
}

interface SignatureResult {
  signature: string;
  algorithm: PQAlgorithm;
  keyId: string;
  timestamp: Date;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PostQuantumKMSPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [algorithms, setAlgorithms] = useState<AlgorithmSpec[]>([]);
  const [keys, setKeys] = useState<PQKeyPair[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<PQAlgorithm>('dilithium2');
  const [selectedStrength, setSelectedStrength] = useState<'standard' | 'high' | 'paranoid'>('standard');
  const [signatureData, setSignatureData] = useState('');
  const [signatureResult, setSignatureResult] = useState<SignatureResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlgorithms();
    loadKeys();
  }, []);

  const loadAlgorithms = async () => {
    try {
      const response = await api.get('/post-quantum/algorithms');
      setAlgorithms((response.data as any).data);
    } catch (err) {
      console.error('Failed to load algorithms, using demo data:', err);
      setAlgorithms([
        { algorithm: 'dilithium2' as PQAlgorithm, nistLevel: 2, signatureSize: 2420, publicKeySize: 1312, privateKeySize: 2528, description: 'CRYSTALS-Dilithium Level 2 - Balanced security/performance' },
        { algorithm: 'dilithium3' as PQAlgorithm, nistLevel: 3, signatureSize: 3293, publicKeySize: 1952, privateKeySize: 4000, description: 'CRYSTALS-Dilithium Level 3 - Higher security' },
        { algorithm: 'dilithium5' as PQAlgorithm, nistLevel: 5, signatureSize: 4595, publicKeySize: 2592, privateKeySize: 4864, description: 'CRYSTALS-Dilithium Level 5 - Maximum security' },
        { algorithm: 'falcon-512' as PQAlgorithm, nistLevel: 1, signatureSize: 690, publicKeySize: 897, privateKeySize: 1281, description: 'FALCON-512 - Compact signatures, fast verification' },
        { algorithm: 'falcon-1024' as PQAlgorithm, nistLevel: 5, signatureSize: 1330, publicKeySize: 1793, privateKeySize: 2305, description: 'FALCON-1024 - Maximum security, compact signatures' },
        { algorithm: 'sphincs-shake-128f' as PQAlgorithm, nistLevel: 1, signatureSize: 17088, publicKeySize: 32, privateKeySize: 64, description: 'SPHINCS+ SHAKE-128f - Hash-based, conservative security' },
        { algorithm: 'hybrid-rsa-dilithium' as PQAlgorithm, nistLevel: 3, signatureSize: 5713, publicKeySize: 3264, privateKeySize: 6528, description: 'Hybrid RSA-4096 + Dilithium3 - Backward compatible' },
      ]);
    }
  };

  const loadKeys = async () => {
    try {
      const response = await api.get('/post-quantum/keys');
      setKeys((response.data as any).data || []);
    } catch (err) {
      console.error('Failed to load keys, using demo data:', err);
      setKeys([
        { id: 'pq-key-001', algorithm: 'dilithium3' as PQAlgorithm, publicKey: 'PQ-PUB-a1b2c3d4...', privateKey: '[ENCRYPTED]', createdAt: new Date('2026-01-01'), expiresAt: new Date('2027-01-01'), strength: 'high', nistLevel: 3, rotatedAt: new Date('2026-01-15') },
        { id: 'pq-key-002', algorithm: 'falcon-512' as PQAlgorithm, publicKey: 'PQ-PUB-e5f6g7h8...', privateKey: '[ENCRYPTED]', createdAt: new Date('2025-12-15'), expiresAt: new Date('2026-12-15'), strength: 'standard', nistLevel: 1 },
        { id: 'pq-key-003', algorithm: 'hybrid-rsa-dilithium' as PQAlgorithm, publicKey: 'PQ-PUB-i9j0k1l2...', privateKey: '[ENCRYPTED]', createdAt: new Date('2025-11-01'), expiresAt: new Date('2026-11-01'), strength: 'paranoid', nistLevel: 3 },
      ]);
    }
  };

  const generateKeyPair = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/post-quantum/keys', {
        algorithm: selectedAlgorithm,
        strength: selectedStrength,
        expiresInDays: 365,
      });
      setKeys([...keys, (response.data as any).data]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate key pair');
    } finally {
      setLoading(false);
    }
  };

  const signData = async () => {
    if (!signatureData.trim()) {
      setError('Please enter data to sign');
      return;
    }
    if (keys.length === 0) {
      setError('Please generate a key pair first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/post-quantum/sign', {
        keyId: keys[0].id,
        data: signatureData,
      });
      setSignatureResult((response.data as any).data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sign data');
    } finally {
      setLoading(false);
    }
  };

  const rotateKey = async (keyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/post-quantum/keys/${keyId}/rotate`);
      setKeys(keys.map(k => k.id === keyId ? (response.data as any).data : k));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to rotate key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-500" />
            CendiaPostQuantumKMS™
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Quantum-Resistant Cryptographic Signatures
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Enterprise Platinum</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-900 dark:text-purple-100">
            <p className="font-semibold mb-1">NIST Post-Quantum Cryptography</p>
            <p className="text-purple-700 dark:text-purple-300">
              Protect your signatures against future quantum computer attacks using NIST-standardized algorithms: 
              Dilithium (lattice-based), SPHINCS+ (hash-based), and Falcon (compact signatures).
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Generation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-500" />
            Generate Key Pair
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Algorithm
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value as PQAlgorithm)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="dilithium2">Dilithium2 (NIST Level 2 - Recommended)</option>
                <option value="dilithium3">Dilithium3 (NIST Level 3)</option>
                <option value="dilithium5">Dilithium5 (NIST Level 5 - Highest Security)</option>
                <option value="sphincs-shake-128f">SPHINCS+ SHAKE-128f (Stateless)</option>
                <option value="sphincs-shake-256f">SPHINCS+ SHAKE-256f (High Security)</option>
                <option value="falcon-512">Falcon-512 (Compact)</option>
                <option value="falcon-1024">Falcon-1024 (High Security)</option>
                <option value="hybrid-rsa-dilithium">Hybrid RSA-Dilithium (Transition)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Strength
              </label>
              <select
                value={selectedStrength}
                onChange={(e) => setSelectedStrength(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="paranoid">Paranoid</option>
              </select>
            </div>

            <button
              onClick={generateKeyPair}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Key Pair
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sign Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileKey className="w-5 h-5 text-purple-500" />
            Sign Data
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data to Sign
              </label>
              <textarea
                value={signatureData}
                onChange={(e) => setSignatureData(e.target.value)}
                placeholder="Enter data to sign..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              />
            </div>

            <button
              onClick={signData}
              disabled={loading || keys.length === 0}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign Data
                </>
              )}
            </button>

            {signatureResult && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Signature Generated</span>
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 font-mono break-all">
                  {signatureResult.signature.substring(0, 64)}...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Keys */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Active Key Pairs ({keys.length})
        </h2>

        {keys.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No key pairs generated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {key.algorithm}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
                        NIST Level {key.nistLevel}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                        {key.strength}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        Expires {new Date(key.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => rotateKey(key.id)}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Rotate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Algorithm Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Algorithm Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Algorithm</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">NIST Level</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Signature Size</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">Description</th>
              </tr>
            </thead>
            <tbody>
              {algorithms.map((algo) => (
                <tr key={algo.algorithm} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-3 font-mono text-xs">{algo.algorithm}</td>
                  <td className="py-2 px-3">{algo.nistLevel}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{algo.signatureSize} bytes</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{algo.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
