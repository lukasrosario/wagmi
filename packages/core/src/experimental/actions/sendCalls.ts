import type { Account, Chain, Hash, Hex } from 'viem'
import {
  type SendCallsErrorType as viem_SendCallsErrorType,
  type SendCallsParameters as viem_SendCallsParameters,
  type SendCallsReturnType as viem_SendCallsReturnType,
  prepareCalls as viem_prepareCalls,
  sendCalls as viem_sendCalls,
  sendPreparedCalls as viem_sendPreparedCalls,
} from 'viem/experimental'

import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from '../../actions/getConnectorClient.js'
import type { Config } from '../../createConfig.js'
import type { BaseErrorType, ErrorType } from '../../errors/base.js'
import type { SelectChains } from '../../types/chain.js'
import type {
  ChainIdParameter,
  ConnectorParameter,
} from '../../types/properties.js'
import type { Compute } from '../../types/utils.js'

export type SendCallsParameters<
  config extends Config = Config,
  chainId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  ///
  chains extends readonly Chain[] = SelectChains<config, chainId>,
> = {
  [key in keyof chains]: Compute<
    Omit<viem_SendCallsParameters<chains[key], Account, chains[key]>, 'chain'> &
      ChainIdParameter<config, chainId> &
      ConnectorParameter
  >
}[number] & {
  signatureOverride?: Hex | ((hash: Hash) => Promise<Hex>)
}

export type SendCallsReturnType = viem_SendCallsReturnType

export type SendCallsErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // viem
  | viem_SendCallsErrorType

/** https://wagmi.sh/core/api/actions/sendCalls */
export async function sendCalls<
  config extends Config,
  chainId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: SendCallsParameters<config, chainId>,
): Promise<SendCallsReturnType> {
  const {
    account,
    chainId,
    connector,
    calls,
    signatureOverride,
    capabilities,
    ...rest
  } = parameters

  const client = await getConnectorClient(config, {
    account,
    chainId,
    connector,
  })

  if (!!signatureOverride) {
    const preparedCalls = await viem_prepareCalls(client, {
      ...(rest as any),
      ...(account ? { account } : {}),
      calls,
      capabilities,
      chain: chainId ? { id: chainId } : undefined,
    })
    const signature = typeof signatureOverride === 'function' ? await signatureOverride(preparedCalls[0].signatureRequest.hash) : signatureOverride
    return viem_sendPreparedCalls(client, {
      preparedCalls: preparedCalls[0].preparedCalls,
      context: preparedCalls[0].context,
      signature,
      chain: chainId ? { id: chainId } : undefined,
    } as any)
  }

  return viem_sendCalls(client, {
    ...(rest as any),
    ...(account ? { account } : {}),
    calls,
    chain: chainId ? { id: chainId } : undefined,
  })
}
