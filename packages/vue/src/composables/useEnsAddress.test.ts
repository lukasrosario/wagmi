import { renderComposable, waitFor } from '@wagmi/test/vue'
import { expect, test } from 'vitest'

import { deepUnref } from '../utils/cloneDeep.js'
import { useEnsAddress } from './useEnsAddress.js'

test('default', async () => {
  const [result] = renderComposable(() =>
    useEnsAddress({
      name: 'wevm.eth',
    }),
  )

  await waitFor(result.isSuccess)

  expect(deepUnref(result)).toMatchInlineSnapshot(`
    {
      "data": "0xd2135CfB216b74109775236E36d4b433F1DF507B",
      "dataUpdatedAt": 1675209600000,
      "error": null,
      "errorUpdateCount": 0,
      "errorUpdatedAt": 0,
      "failureCount": 0,
      "failureReason": null,
      "fetchStatus": "idle",
      "isError": false,
      "isFetched": true,
      "isFetchedAfterMount": true,
      "isFetching": false,
      "isInitialLoading": false,
      "isLoading": false,
      "isLoadingError": false,
      "isPaused": false,
      "isPending": false,
      "isPlaceholderData": false,
      "isRefetchError": false,
      "isRefetching": false,
      "isStale": true,
      "isSuccess": true,
      "queryKey": [
        "ensAddress",
        {
          "chainId": 1,
          "name": "wevm.eth",
        },
      ],
      "refetch": [Function],
      "status": "success",
      "suspense": [Function],
    }
  `)
})
