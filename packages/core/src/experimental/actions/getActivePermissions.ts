import {
  type GetActivePermissionsParameters as viem_GetActivePermissionsParameters,
  type GetActivePermissionsReturnType as viem_GetActivePermissionsReturnType,
  getActivePermissions as viem_getActivePermissions,
} from "viem/experimental";
import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/base.js";

import { getConnectorClient } from "../../actions/getConnectorClient.js";
import type { Config } from "../../createConfig.js";
import type { ConnectorParameter } from "../../types/properties.js";
import type { Account } from "viem";

export type GetActivePermissionsParameters =
  viem_GetActivePermissionsParameters<Account> & ConnectorParameter;

export type GetActivePermissionsReturnType =
  viem_GetActivePermissionsReturnType;

export type GetActivePermissionsErrorType = RequestErrorType | ErrorType;

export async function getActivePermissions<config extends Config>(
  config: config,
  parameters: GetActivePermissionsParameters = {}
) {
  const { account, connector } = parameters;
  const client = await getConnectorClient(config, { account, connector });
  return viem_getActivePermissions(client as any, { account: account as Account });
}
