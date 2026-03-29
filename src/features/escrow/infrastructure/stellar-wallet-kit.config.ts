import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";
import {
  FREIGHTER_ID,
  FreighterModule,
} from "@creit.tech/stellar-wallets-kit/modules/freighter";
import {
  LOBSTR_ID,
  LobstrModule,
} from "@creit.tech/stellar-wallets-kit/modules/lobstr";
import type { WalletProvider } from "../../wallet/domain/wallet.types";

/**
 * Stellar Wallet Kit — singleton initialization
 *
 * Used exclusively for XDR transaction signing.
 * The actual wallet connection/state remains managed by the
 * existing WalletContext (Freighter + LOBSTR adapters).
 */
StellarWalletsKit.init({
  modules: [new FreighterModule(), new LobstrModule()],
});

interface SignTransactionParams {
  unsignedTransaction: string;
  address: string;
  provider: WalletProvider;
}

/**
 * Sign an XDR transaction using the connected Stellar wallet.
 *
 * This is the ONLY place private keys are used — everything stays
 * client-side. The backend never sees the user's secret key.
 *
 * @param unsignedTransaction - The unsigned XDR string from Trustless Work API
 * @param address - The Stellar public key signing the transaction
 * @returns The signed XDR string ready for broadcast
 */
export const signTransaction = async ({
  unsignedTransaction,
  address,
  provider,
}: SignTransactionParams): Promise<string> => {
  StellarWalletsKit.setWallet(provider === "freighter" ? FREIGHTER_ID : LOBSTR_ID);

  const { signedTxXdr } = await StellarWalletsKit.signTransaction(
    unsignedTransaction,
    {
      address,
      networkPassphrase: Networks.TESTNET,
    }
  );
  return signedTxXdr;
};
