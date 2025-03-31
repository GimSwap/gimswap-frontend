import ContentBox from '../_components/ContentBox';

export default function SwapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentBox>{children}</ContentBox>;
}
