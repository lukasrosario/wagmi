import type { MutateOptions, MutationOptions } from '@tanstack/query-core'

import type { Config } from '../../createConfig.js'
import type { Compute } from '../../types/utils.js'
import {
  type GrantPermissionsErrorType,
  type GrantPermissionsParameters,
  type GrantPermissionsReturnType,
  grantPermissions,
} from '../actions/grantPermissions.js'

export function grantPermissionsMutationOptions<config extends Config>(
  config: config,
) {
  return {
    mutationFn(variables) {
      return grantPermissions(config, variables)
    },
    mutationKey: ['grantPermissions'],
  } as const satisfies MutationOptions<
    GrantPermissionsReturnType,
    GrantPermissionsErrorType,
    GrantPermissionsParameters
  >
}

export type GrantPermissionsData = Compute<GrantPermissionsReturnType>

export type GrantPermissionsVariables = GrantPermissionsParameters

export type GrantPermissionsMutate<context = unknown> = (
  variables: GrantPermissionsVariables,
  options?:
    | Compute<
        MutateOptions<
          GrantPermissionsData,
          GrantPermissionsErrorType,
          GrantPermissionsVariables,
          context
        >
      >
    | undefined,
) => void

export type GrantPermissionsMutateAsync<context = unknown> = (
  variables: GrantPermissionsVariables,
  options?:
    | Compute<
        MutateOptions<
          GrantPermissionsData,
          GrantPermissionsErrorType,
          GrantPermissionsVariables,
          context
        >
      >
    | undefined,
) => Promise<GrantPermissionsData>
