import { useAccount } from 'wagmi';
import PopupTemplate from '../PopupTemplate';
interface WalletInfoPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function WalletInfoPopup({
  open,
  onClose,
}: WalletInfoPopupProps) {
  const { connector, chainId } = useAccount();
  return (
    <PopupTemplate open={open} onClose={onClose}>
      <div className="overflow-scroll h-[80vh]">
        <p>
          connector name : {connector?.name}
          <br />
          chainId : {chainId}
          <br />
          connectorId : {connector?.id}
          <br />
        </p>
      </div>
    </PopupTemplate>
  );
}
