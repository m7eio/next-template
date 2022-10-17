import React from 'react';
import { useRequest } from 'ahooks';
import { getUserByAddress } from '@/service/v1/user';

export default function useUser(address?: string) {
  const { run, data, loading } = useRequest((addr) => getUserByAddress(addr), {
    manual: true,
    cacheKey: address,
  });

  const init = React.useCallback(async () => {
    if (!address) return;
    run(address);
  }, [address]);

  const refresh = React.useCallback(async () => {
    if (!address) return;
    run(address);
  }, [address]);

  React.useEffect(() => {
    init();
  }, [address]);

  return {
    loading,
    data: data?.data,
    refresh,
  };
}
