export const withDraftMode = (
  Component: React.ComponentType,
  DraftComponent: React.ComponentType,
) => {
  const envMode = process.env.NEXT_PUBLIC_ENV_MODE;
  return (props: any) =>
    envMode === 'local' ? (
      <DraftComponent {...props} />
    ) : (
      <Component {...props} />
    );
};
