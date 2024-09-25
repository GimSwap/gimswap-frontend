import Accordion from '@/src/components/Accordion';

export default function FAQ() {
  return (
    <section className="w-full rounded-2xl p-6 shadow-customShadow flex flex-col gap-3 mb-[56px]">
      <Accordion title="What is $KRWO?">
        <p className="c1">
          KRWO is a Real-World Asset(RWA) backed token issued based on
          Open(Voucher), a voucher that can be exchanged 1:1 with Korean Won.
          $KRWO is designed to serve as a bridge between the real world and the
          Web3 universe.
        </p>
      </Accordion>
      <Accordion title="Is $KRWO a stablecoin?">
        <p className="c1">
          $KRWO can be conisdered as an asset-backed stable coin, one of the
          safest types of stablecoins. $KRWO is fully backed by real-world
          assets. You can exchange $KRWO for Open(Voucher), which is redeemable
          for Korean Won.
        </p>
      </Accordion>
      <Accordion title="What is Open(Voucher)?">
        <p className="c1">
          Open(Voucher) is a voucher issued by Open(Asset) that can be exchanged
          1:1 with Korean Won. It can be transferred and redeemed on the
          blockchain, making it usable not only within the Open(Voucher) service
          but also in various Web3 platforms.
        </p>
      </Accordion>
      <Accordion title="Where can I get Open(Voucher)?">
        <p className="c1 text-black-8">
          There are two main ways to obtain Open(Voucher):
        </p>
        <ul className="c1 translate-x-4 text-black-8">
          <li className="list-decimal">
            <span className="font-bold">
              Purchase from the Open(Voucher) Service:
            </span>
            <br />
            The Open(Voucher) Service allows users to buy and refund
            Open(Voucher) in Korean Won via bank transfer. Anyone with a Korean
            bank account can deposit funds into the Open(Voucher) service and
            receive Open(Voucher) in return.
          </li>

          <li className="list-decimal">
            <span className="font-bold">Purchase from a DEX:</span>
            <br />
            Open(Voucher) is available on decentralized exchanges (DEX) for
            those without a Korean bank account. You can swap crypto for $KRWO
            and then exchange $KRWO for Open(Voucher) on GimSwap.
          </li>
        </ul>
      </Accordion>
      <Accordion title="How the conversion between $KRWO and Open(Voucher) work?">
        <p className="c1">
          Since the exchange rate between $KRWO and Open(Voucher) is 1:1, when
          Open(Voucher) is deposited, $KRWO is minted and the Open(Voucher) is
          locked. Conversely, when $KRWO is deposited, it is burned, and the
          corresponding Open(Voucher) is unlocked. This mechanism ensures there
          is no excess issuance of $KRWO.
        </p>
      </Accordion>
    </section>
  );
}
