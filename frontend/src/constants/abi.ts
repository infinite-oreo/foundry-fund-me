/**
 * [INPUT]: 由 forge build 产物 out/FundMe.sol/FundMe.json 提取
 * [OUTPUT]: 对外提供 FUND_ME_ABI，供 wagmi useReadContract/useWriteContract 消费
 * [POS]: constants/ 的 ABI 定义，as const 保留字面量类型供 TypeScript 推断
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export const FUND_ME_ABI = [
  {
    type: 'constructor',
    inputs: [{ name: 'priceFeed', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  { type: 'fallback', stateMutability: 'payable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: 'MINIMUM_USD',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cheaperWithdraw',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fund',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getAddressToAmountFunded',
    inputs: [{ name: 'fundingAddress', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFunder',
    inputs: [{ name: 'index', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getOwner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getVersion',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', name: 'NotOwner', inputs: [] },
] as const
