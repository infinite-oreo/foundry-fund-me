/**
 * [INPUT]: 依赖 wagmi hooks、viem、FUND_ME_ABI、CONTRACT_ADDRESSES
 * [OUTPUT]: 对外提供 useContractAddress, useFundMeStats, useMyContribution, useFund, useWithdraw
 * [POS]: hooks/ 的核心聚合层，封装所有合约读写逻辑，组件不直接调用 wagmi
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

'use client'

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  useAccount,
  useChainId,
} from 'wagmi'
import { parseEther } from 'viem'
import { FUND_ME_ABI } from '@/constants/abi'
import { CONTRACT_ADDRESSES } from '@/constants/addresses'

export function useContractAddress(): `0x${string}` | undefined {
  const chainId = useChainId()
  const addr = CONTRACT_ADDRESSES[chainId]
  // 地址未配置或为占位符时返回 undefined
  if (!addr || addr === '0x') return undefined
  return addr
}

export function useFundMeStats() {
  const contractAddress = useContractAddress()
  const enabled = !!contractAddress

  const { data: minimumUsd, error: minError } = useReadContract({
    address: contractAddress,
    abi: FUND_ME_ABI,
    functionName: 'MINIMUM_USD',
    query: { enabled, staleTime: 0, refetchInterval: 5_000, refetchOnMount: 'always' },
  })

  const { data: owner, error: ownerError } = useReadContract({
    address: contractAddress,
    abi: FUND_ME_ABI,
    functionName: 'getOwner',
    query: { enabled, staleTime: 0, refetchInterval: 5_000, refetchOnMount: 'always' },
  })

  if (minError) console.error('[MINIMUM_USD]', minError)
  if (ownerError) console.error('[getOwner]', ownerError)

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: contractAddress,
    query: { enabled, refetchInterval: 15_000 },
  })

  return { minimumUsd, owner, balance, refetchBalance }
}

export function useMyContribution() {
  const contractAddress = useContractAddress()
  const { address: userAddress } = useAccount()
  const enabled = !!contractAddress && !!userAddress

  const { data: contribution, refetch } = useReadContract({
    address: contractAddress,
    abi: FUND_ME_ABI,
    functionName: 'getAddressToAmountFunded',
    args: [userAddress!],
    query: { enabled },
  })

  return { contribution, refetch }
}

export function useFund() {
  const contractAddress = useContractAddress()
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const fund = (ethAmount: string) => {
    if (!contractAddress) return
    writeContract({
      address: contractAddress,
      abi: FUND_ME_ABI,
      functionName: 'fund',
      value: parseEther(ethAmount),
    })
  }

  return { fund, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useWithdraw() {
  const contractAddress = useContractAddress()
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const withdraw = () => {
    if (!contractAddress) return
    writeContract({
      address: contractAddress,
      abi: FUND_ME_ABI,
      functionName: 'withdraw',
    })
  }

  return { withdraw, hash, isPending, isConfirming, isSuccess, error, reset }
}
