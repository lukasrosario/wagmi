'use client'

import { useMutation } from '@tanstack/react-query'
import type { Config, ResolvedRegister } from '@wagmi/core'
import {
  type GrantPermissionsData,
  type GrantPermissionsErrorType,
  type GrantPermissionsMutate,
  type GrantPermissionsMutateAsync,
  type GrantPermissionsVariables,
  grantPermissionsMutationOptions,
} from '@wagmi/core/experimental'
import type { Compute } from '@wagmi/core/internal'

import { useConfig } from '../../hooks/useConfig.js'
import type { ConfigParameter } from '../../types/properties.js'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../../utils/query.js'

export type UseGrantPermissionsParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          GrantPermissionsData,
          GrantPermissionsErrorType,
          GrantPermissionsVariables,
          context
        >
      | undefined
  }
>

export type UseGrantPermissionsReturnType<context = unknown> = Compute<
  UseMutationReturnType<
    GrantPermissionsData,
    GrantPermissionsErrorType,
    GrantPermissionsVariables,
    context
  > & {
    grantPermissions: GrantPermissionsMutate<context>
    grantPermissionsAsync: GrantPermissionsMutateAsync<context>
  }
>

export function useGrantPermissions<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseGrantPermissionsParameters<config, context> = {},
): UseGrantPermissionsReturnType<context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = grantPermissionsMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseGrantPermissionsReturnType<context>
  return {
    ...result,
    grantPermissions: mutate as Return['grantPermissions'],
    grantPermissionsAsync: mutateAsync as Return['grantPermissionsAsync'],
  }
}
