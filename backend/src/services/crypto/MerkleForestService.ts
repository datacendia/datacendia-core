/**
 * CendiaMerkleForest™ — Cross-Receipt Tamper-Evident Registry
 *
 * Every Regulator's Receipt hash becomes a leaf in an organization-wide
 * Merkle tree. Deleting or modifying ANY receipt breaks the entire chain.
 * A single root hash proves the integrity of the full decision history.
 *
 * Like a private decision blockchain — without the blockchain.
 *
 * @module services/crypto/MerkleForestService
 * @exports merkleForestService
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, utf8ToBytes, concatBytes } from '@noble/hashes/utils';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface MerkleLeaf {
  index: number;
  receiptId: string;
  receiptHash: string;
  timestamp: string;
}

export interface MerkleProof {
  leaf: MerkleLeaf;
  siblings: { hash: string; position: 'left' | 'right' }[];
  root: string;
  treeSize: number;
}

export interface MerkleForestState {
  organizationId: string;
  root: string;
  leafCount: number;
  lastUpdated: string;
  leaves: MerkleLeaf[];
}

export interface ForestVerification {
  valid: boolean;
  root: string;
  expectedRoot: string;
  leafCount: number;
  tamperedLeaves: string[];
  verifiedAt: string;
}

// =============================================================================
// SERVICE
// =============================================================================

export class MerkleForestService {
  private static instance: MerkleForestService;
  private forests = new Map<string, MerkleForestState>();

  private constructor() {
    logger.info('🌳 CendiaMerkleForest: Initialized — tamper-evident decision registry active');
  }

  static getInstance(): MerkleForestService {
    if (!MerkleForestService.instance) {
      MerkleForestService.instance = new MerkleForestService();
    }
    return MerkleForestService.instance;
  }

  // ---------------------------------------------------------------------------
  // APPEND
  // ---------------------------------------------------------------------------

  /**
   * Append a receipt hash to the organization's Merkle forest.
   * Returns the new root and a Merkle inclusion proof.
   */
  appendReceipt(organizationId: string, receiptId: string, receiptHash: string): {
    root: string;
    proof: MerkleProof;
    leafIndex: number;
  } {
    let forest = this.forests.get(organizationId);
    if (!forest) {
      forest = {
        organizationId,
        root: '',
        leafCount: 0,
        lastUpdated: new Date().toISOString(),
        leaves: [],
      };
      this.forests.set(organizationId, forest);
    }

    const leaf: MerkleLeaf = {
      index: forest.leafCount,
      receiptId,
      receiptHash,
      timestamp: new Date().toISOString(),
    };

    forest.leaves.push(leaf);
    forest.leafCount++;
    forest.lastUpdated = leaf.timestamp;

    // Recompute the full Merkle root
    forest.root = this.computeRoot(forest.leaves);

    // Generate inclusion proof for the new leaf
    const proof = this.generateInclusionProof(forest, leaf.index);

    logger.info(`🌳 MerkleForest: Appended receipt ${receiptId} to org ${organizationId} (leaf #${leaf.index}, root: ${forest.root.substring(0, 16)}...)`);

    return {
      root: forest.root,
      proof,
      leafIndex: leaf.index,
    };
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION
  // ---------------------------------------------------------------------------

  /**
   * Verify an inclusion proof — prove a receipt exists in the tree without
   * downloading the entire tree.
   */
  verifyInclusionProof(proof: MerkleProof): boolean {
    let currentHash = this.hashLeaf(proof.leaf);

    for (const sibling of proof.siblings) {
      if (sibling.position === 'left') {
        currentHash = this.hashPair(sibling.hash, currentHash);
      } else {
        currentHash = this.hashPair(currentHash, sibling.hash);
      }
    }

    return currentHash === proof.root;
  }

  /**
   * Verify the entire forest — recompute root from all leaves and check
   * for any tampering.
   */
  verifyForest(organizationId: string): ForestVerification {
    const forest = this.forests.get(organizationId);
    if (!forest) {
      return {
        valid: false,
        root: '',
        expectedRoot: '',
        leafCount: 0,
        tamperedLeaves: [],
        verifiedAt: new Date().toISOString(),
      };
    }

    const computedRoot = this.computeRoot(forest.leaves);
    const tamperedLeaves: string[] = [];

    // Verify each leaf's inclusion proof
    for (let i = 0; i < forest.leaves.length; i++) {
      const proof = this.generateInclusionProof(forest, i);
      if (!this.verifyInclusionProof(proof)) {
        tamperedLeaves.push(forest.leaves[i].receiptId);
      }
    }

    return {
      valid: computedRoot === forest.root && tamperedLeaves.length === 0,
      root: computedRoot,
      expectedRoot: forest.root,
      leafCount: forest.leafCount,
      tamperedLeaves,
      verifiedAt: new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // STATE ACCESS
  // ---------------------------------------------------------------------------

  getForestState(organizationId: string): MerkleForestState | undefined {
    return this.forests.get(organizationId);
  }

  getRoot(organizationId: string): string | undefined {
    return this.forests.get(organizationId)?.root;
  }

  // ---------------------------------------------------------------------------
  // MERKLE TREE INTERNALS
  // ---------------------------------------------------------------------------

  private computeRoot(leaves: MerkleLeaf[]): string {
    if (leaves.length === 0) return this.hashData('empty-tree');
    if (leaves.length === 1) return this.hashLeaf(leaves[0]);

    const leafHashes = leaves.map(l => this.hashLeaf(l));
    return this.buildTree(leafHashes);
  }

  private buildTree(hashes: string[]): string {
    if (hashes.length === 1) return hashes[0];

    const nextLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = hashes[i + 1] || left; // Duplicate if odd
      nextLevel.push(this.hashPair(left, right));
    }

    return this.buildTree(nextLevel);
  }

  private generateInclusionProof(forest: MerkleForestState, leafIndex: number): MerkleProof {
    const leaf = forest.leaves[leafIndex];
    const leafHashes = forest.leaves.map(l => this.hashLeaf(l));
    const siblings: { hash: string; position: 'left' | 'right' }[] = [];

    let currentLevel = leafHashes;
    let index = leafIndex;

    while (currentLevel.length > 1) {
      const siblingIndex = index % 2 === 0 ? index + 1 : index - 1;
      const siblingHash = siblingIndex < currentLevel.length
        ? currentLevel[siblingIndex]
        : currentLevel[index]; // Duplicate if odd

      siblings.push({
        hash: siblingHash,
        position: index % 2 === 0 ? 'right' : 'left',
      });

      // Move to next level
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left;
        nextLevel.push(this.hashPair(left, right));
      }

      currentLevel = nextLevel;
      index = Math.floor(index / 2);
    }

    return {
      leaf,
      siblings,
      root: forest.root,
      treeSize: forest.leafCount,
    };
  }

  private hashLeaf(leaf: MerkleLeaf): string {
    return this.hashData(`leaf:${leaf.index}:${leaf.receiptId}:${leaf.receiptHash}:${leaf.timestamp}`);
  }

  private hashPair(left: string, right: string): string {
    return this.hashData(`node:${left}:${right}`);
  }

  private hashData(data: string): string {
    return bytesToHex(sha256(utf8ToBytes(data)));
  }
}

// Export singleton
export const merkleForestService = MerkleForestService.getInstance();
