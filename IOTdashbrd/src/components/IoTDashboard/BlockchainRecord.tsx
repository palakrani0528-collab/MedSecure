import React from 'react';
import { Link, Hash, Clock, ExternalLink } from 'lucide-react';

interface BlockchainRecordProps {
  record: {
    id: string;
    transactionHash: string;
    blockNumber: number;
    ipfsCid?: string;
    batchId: string;
    timestamp: string;
    gasUsed: number;
    status: 'confirmed' | 'pending' | 'failed';
    verificationResult: 'safe' | 'unsafe' | 'unknown';
    dataHash: string;
  };
  onViewExplorer: (txHash: string) => void;
  onViewIPFS?: (cid: string) => void;
}

const statusColors = {
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  failed: 'bg-red-100 text-red-800 border-red-200'
};

const resultColors = {
  safe: 'bg-green-100 text-green-800 border-green-200',
  unsafe: 'bg-red-100 text-red-800 border-red-200',
  unknown: 'bg-gray-100 text-gray-800 border-gray-200'
};

export const BlockchainRecord: React.FC<BlockchainRecordProps> = ({
  record,
  onViewExplorer,
  onViewIPFS
}) => {
  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatGas = (gas: number) => {
    return (gas / 1000).toFixed(1) + 'K';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Record</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${statusColors[record.status]}`}>
          {record.status.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        {/* Transaction Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Transaction Details</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transaction Hash:</span>
              <button
                onClick={() => onViewExplorer(record.transactionHash)}
                className="flex items-center gap-1 text-sm font-mono text-blue-600 hover:text-blue-800"
              >
                {formatHash(record.transactionHash)}
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Block Number:</span>
              <span className="text-sm font-mono text-gray-900">#{record.blockNumber.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Gas Used:</span>
              <span className="text-sm font-mono text-gray-900">{formatGas(record.gasUsed)}</span>
            </div>
          </div>
        </div>

        {/* Data Integrity */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Data Integrity</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Hash:</span>
              <span className="text-sm font-mono text-gray-900">{formatHash(record.dataHash)}</span>
            </div>
            
            {record.ipfsCid && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">IPFS CID:</span>
                <button
                  onClick={() => onViewIPFS?.(record.ipfsCid!)}
                  className="flex items-center gap-1 text-sm font-mono text-blue-600 hover:text-blue-800"
                >
                  {formatHash(record.ipfsCid)}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verification:</span>
              <div className={`px-2 py-1 rounded border text-xs font-medium ${resultColors[record.verificationResult]}`}>
                {record.verificationResult.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Record Metadata</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Batch ID:</span>
              <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
                {record.batchId}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Timestamp:</span>
              <div className="flex items-center gap-1 text-sm text-gray-900">
                <Clock className="w-3 h-3" />
                {new Date(record.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onViewExplorer(record.transactionHash)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View on Explorer
        </button>
        
        {record.ipfsCid && onViewIPFS && (
          <button
            onClick={() => onViewIPFS(record.ipfsCid!)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
          >
            <Hash className="w-4 h-4" />
            View Raw Data
          </button>
        )}
      </div>
    </div>
  );
};