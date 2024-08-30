import type { QueryOptions } from '@tanstack/query-core'

import type { Config } from '../../createConfig.js'
import { ConnectorNotConnectedError } from '../../errors/config.js'
import { filterQueryOptions } from '../../query/utils.js'
import type { ScopeKeyParameter } from '../../types/properties.js'
import type { Compute, ExactPartial } from '../../types/utils.js'
import {
  type GetActivePermissionsErrorType,
  type GetActivePermissionsParameters,
  type GetActivePermissionsReturnType,
  getActivePermissions,
} from '../actions/getActivePermissions.js'

export type GetActivePermissionsOptions = Compute<
  ExactPartial<GetActivePermissionsParameters> & ScopeKeyParameter
>

export function getActivePermissionsQueryOptions<config extends Config>(
  config: config,
  options: GetActivePermissionsOptions = {},
) {
  return {
    async queryFn({ queryKey }) {
      const { scopeKey: _, ...parameters } = queryKey[1]
      const permissions = await getActivePermissions(config, parameters)
      return permissions
    },
    queryKey: getActivePermissionsQueryKey(options),
    retry(failureCount, error) {
      if (error instanceof ConnectorNotConnectedError) return false
      return failureCount < 3
    },
  } as const satisfies QueryOptions<
    GetActivePermissionsQueryFnData,
    GetActivePermissionsErrorType,
    GetActivePermissionsData,
    GetActivePermissionsQueryKey
  >
}

export type GetActivePermissionsQueryFnData = GetActivePermissionsReturnType

export type GetActivePermissionsData = GetActivePermissionsQueryFnData

export function getActivePermissionsQueryKey(
  options: GetActivePermissionsOptions,
) {
  return ['activePermissions', filterQueryOptions(options)] as const
}

export type GetActivePermissionsQueryKey = ReturnType<
  typeof getActivePermissionsQueryKey
>
