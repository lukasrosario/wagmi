'use client'

import type { Config, ResolvedRegister } from '@wagmi/core'

import {
  type GetActivePermissionsData,
  type GetActivePermissionsErrorType,
  type GetActivePermissionsOptions,
  type GetActivePermissionsQueryFnData,
  type GetActivePermissionsQueryKey,
  getActivePermissionsQueryOptions,
} from '@wagmi/core/experimental'
import type { Compute } from '@wagmi/core/internal'

import { useAccount } from '../../hooks/useAccount.js'
import { useConfig } from '../../hooks/useConfig.js'
import type { ConfigParameter, QueryParameter } from '../../types/properties.js'
import { type UseQueryReturnType, useQuery } from '../../utils/query.js'

export type UseActivePermissionsParameters<
  config extends Config = Config,
  selectData = GetActivePermissionsData,
> = Compute<
  GetActivePermissionsOptions &
    ConfigParameter<config> &
    QueryParameter<
      GetActivePermissionsQueryFnData,
      GetActivePermissionsErrorType,
      selectData,
      GetActivePermissionsQueryKey
    >
>

export type UseActivePermissionsReturnType<
  selectData = GetActivePermissionsData,
> = UseQueryReturnType<selectData, GetActivePermissionsErrorType>

export function useActivePermissions<
  config extends Config = ResolvedRegister['config'],
  selectData = GetActivePermissionsData,
>(
  parameters: UseActivePermissionsParameters<config, selectData> = {},
): UseActivePermissionsReturnType<selectData> {
  const { account, query = {} } = parameters

  const { address } = useAccount()
  const config = useConfig(parameters)

  const options = getActivePermissionsQueryOptions(config, {
    ...parameters,
    account: account ?? address,
  })

  return useQuery({ ...query, ...options })
}
