export const fetchGetQuickDepositEventNotice = async (
  locale: string,
): Promise<Record<string, string>> => {
  const response = await fetch(
    `https://objectstorage.kr-central-2.kakaocloud.com/v1/4fb2aefc68dd495ea9908aa4ad074242/gimswap-prod/${locale}/text/quickDepositEventNotice.json`,
  );

  if (!response.ok) return {};

  return response.json();
};

export const fetchGetEventExpired = async (): Promise<
  Record<string, string>
> => {
  const response = await fetch(
    `https://objectstorage.kr-central-2.kakaocloud.com/v1/4fb2aefc68dd495ea9908aa4ad074242/gimswap-prod/quickDepositEventExpire.json`,
  );

  if (!response.ok) return {};
  return response.json();
};
