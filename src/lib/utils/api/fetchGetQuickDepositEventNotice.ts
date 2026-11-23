export const fetchGetQuickDepositEventNotice = async (
  locale: string,
): Promise<Record<string, string>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KAKAO_BUCKECT_URL}/${locale}/text/quickDepositEventNotice.json`,
  );

  if (!response.ok) return {};

  return response.json();
};

export const fetchGetEventExpired = async (): Promise<
  Record<string, string>
> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KAKAO_BUCKECT_URL}/quickDepositEventExpire.json`,
  );

  if (!response.ok) return {};
  return response.json();
};
