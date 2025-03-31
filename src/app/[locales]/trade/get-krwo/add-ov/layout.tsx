import BuyOVProgress from './_components/BuyOVProgress';

export default function AddOVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BuyOVProgress />
      {children}
    </>
  );
}
