import Accordion from '@/src/components/Accordion';

export default function FAQ() {
  return (
    <section className="w-full rounded-2xl p-6 shadow-customShadow flex flex-col gap-3 mb-[56px]">
      <Accordion title="What is KRWO?">
        <p className="c1">
          KRWO is a Fiat-backed Asset token backed by a voucher token,
          Open(Voucher), which can be exchanged on a one-to-one basis for Korean
          Won. It is designed to serve as a bridge that connects the real world
          to the Web3 ecosystem.
        </p>
      </Accordion>
      <Accordion title="Is KRWO a stablecoin?">
        <p className="c1">
          KRWO could be considered an asset-backed stablecoin, one of the safest
          types of stablecoins. Since it is fully backed by Fiat-backed Assets,
          you can redeem Korean Won by exchanging KRWO for Open(Voucher), or
          mint KRWO by purchasing Open(Voucher) with Korean Won.
        </p>
      </Accordion>
      <Accordion title="What is Open(Voucher)?">
        <p className="c1">
          Open(Voucher), a voucher that can be exchanged for Korean Won on a
          one-to-one basis, is issued by Open(Asset). It is designed to be used
          and transferred on the blockchain, allowing it to be freely utilized
          across various Web3 ecosystems beyond the Open(Voucher) service.
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
            those without a Korean bank account. Crypto can be swapped for KRWO,
            which can then be exchanged for Open(Voucher) on GimSwap.
          </li>
        </ul>
      </Accordion>
      <Accordion title="How the conversion between KRWO and Open(Voucher) work?">
        <p className="c1">
          Since the exchange rate between KRWO and Open(Voucher) is 1:1, when
          Open(Voucher) is deposited, KRWO is minted and the Open(Voucher) is
          locked. Conversely, when KRWO is deposited, it is burned, and the
          corresponding Open(Voucher) is unlocked. This mechanism ensures there
          is no excess issuance of KRWO.
        </p>
      </Accordion>
    </section>
  );
}
