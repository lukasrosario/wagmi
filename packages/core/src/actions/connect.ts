import type {
  Address,
  ResourceUnavailableRpcErrorType,
  UserRejectedRequestErrorType,
  WalletGrantPermissionsParameters,
  WalletGrantPermissionsReturnType,
} from 'viem'

import type { CreateConnectorFn } from '../connectors/createConnector.js'
import type { Config, Connector } from '../createConfig.js'
import type { BaseErrorType, ErrorType } from '../errors/base.js'
import {
  ConnectorAlreadyConnectedError,
  type ConnectorAlreadyConnectedErrorType,
} from '../errors/config.js'
import type { ChainIdParameter } from '../types/properties.js'
import type { Evaluate } from '../types/utils.js'

export type ConnectParameters<config extends Config = Config> = Evaluate<
  ChainIdParameter<config> & {
    connector: Connector | CreateConnectorFn
  }
> & {requests: ({permissions: WalletGrantPermissionsParameters} | {message: string})[]}

export type ConnectReturnType<config extends Config = Config> = {
  requestResponses: (WalletGrantPermissionsReturnType | `0x${string}`)[]
  accounts: readonly [Address, ...Address[]]
  chainId:
    | config['chains'][number]['id']
    | (number extends config['chains'][number]['id'] ? number : number & {})
}

export type ConnectErrorType =
  | ConnectorAlreadyConnectedErrorType
  // connector.connect()
  | UserRejectedRequestErrorType
  | ResourceUnavailableRpcErrorType
  // base
  | BaseErrorType
  | ErrorType

/** https://wagmi.sh/core/api/actions/connect */
export async function connect<config extends Config>(
  config: config,
  parameters: ConnectParameters<config>,
): Promise<ConnectReturnType<config>> {
  // "Register" connector if not already created
  let connector: Connector
  if (typeof parameters.connector === 'function') {
    connector = config._internal.connectors.setup(parameters.connector)
  } else connector = parameters.connector

  // Check if connector is already connected
  if (connector.uid === config.state.current)
    throw new ConnectorAlreadyConnectedError()

  try {
    config.setState((x) => ({ ...x, status: 'connecting' }))
    connector.emitter.emit('message', { type: 'connecting' })

    const data = await connector.connect({ chainId: parameters.chainId, requests: parameters.requests as ConnectParameters['requests'] })
    const accounts = data.accounts as readonly [Address, ...Address[]]
    console.log('in wagmi core', data)
    const requestResponses = (data as any).requestResponses as (WalletGrantPermissionsReturnType | `0x${string}`)[]

    connector.emitter.off('connect', config._internal.events.connect)
    connector.emitter.on('change', config._internal.events.change)
    connector.emitter.on('disconnect', config._internal.events.disconnect)

    await config.storage?.setItem('recentConnectorId', connector.id)
    config.setState((x) => ({
      ...x,
      connections: new Map(x.connections).set(connector.uid, {
        accounts,
        chainId: data.chainId,
        connector: connector,
      }),
      permissionsContext: (requestResponses.find((requestResponse) => {
        return requestResponse instanceof Object && 'permissions' in requestResponse
      }) as WalletGrantPermissionsReturnType)?.permissionsContext,
      current: connector.uid,
      status: 'connected',

    }))

    return { accounts, chainId: data.chainId, requestResponses }
  } catch (error) {
    config.setState((x) => ({
      ...x,
      // Keep existing connector connected in case of error
      status: x.current ? 'connected' : 'disconnected',
    }))
    throw error
  }
}
