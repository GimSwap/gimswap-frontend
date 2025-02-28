'use client';
import { useEffect } from 'react';
import { initMixpanel } from '../../lib/mixpanelClient';

export default function MixpanelProvider({
  children,
}: React.PropsWithChildren) {
  useEffect(() => {
    initMixpanel(); // Initialize Mixpanel
  }, []);

  return (
    <div>{children}</div>
  );
}
