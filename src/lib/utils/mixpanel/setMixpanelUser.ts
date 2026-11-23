import mixpanel from 'mixpanel-browser';

interface SetMixpanelUserProps {
  walletAddress: `0x${string}`;
  chainId: number;
}

export const setMixpanelUser = ({
  walletAddress,
  chainId,
}: SetMixpanelUserProps) => {
  if (!walletAddress) return;

  mixpanel.identify(walletAddress);
  mixpanel.people.set('walletAddress', walletAddress);
  mixpanel.people.set('chainId', chainId);
};
