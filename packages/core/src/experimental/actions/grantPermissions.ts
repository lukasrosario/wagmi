import {
  type GrantPermissionsParameters as viem_GrantPermissionsParameters,
  type GrantPermissionsReturnType as viem_GrantPermissionsReturnType,
  grantPermissions as viem_grantPermissions,
} from 'viem/experimental'

import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from '../../actions/getConnectorClient.js'
import type { Config } from '../../createConfig.js'
import type { BaseErrorType, ErrorType } from '../../errors/base.js'
import type { ConnectorParameter } from '../../types/properties.js'

export type GrantPermissionsParameters = viem_GrantPermissionsParameters &
  ConnectorParameter

export type GrantPermissionsReturnType = viem_GrantPermissionsReturnType

export type GrantPermissionsErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType

export async function grantPermissions<config extends Config>(
  config: config,
  parameters: GrantPermissionsParameters,
): Promise<GrantPermissionsReturnType> {
  const { connector, permissions, ...rest } = parameters

  const client = await getConnectorClient(config, {
    account: permissions[0]?.account,
    chainId: permissions[0]?.chainId,
    connector,
  })

  return viem_grantPermissions(client, {
    ...(rest as any),
    permissions,
  })
}
