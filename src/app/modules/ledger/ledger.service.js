import nem from 'nem-sdk';
import NemH from "./hw-app-nem";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

/** Service storing Trezor utility functions. */
class Ledger {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor() {
        'ngInject';

        // Service dependencies region //

        // End dependencies region //

        // Service properties region //

        // End properties region //
    }

    // Service methods region //

    createWallet(network) {
        return this.createAccount(network, 0, "Primary")
            .then((account) => ({
                "name": "LEDGER",
                "accounts": {
                    "0": account
                }
            }))
            .catch(err => console.log(err));
    }

    bip44(network, index) {
        // recognize networkId by bip32Path;
        // "44'/43'/networkId'/walletIndex'/accountIndex'"
        // const networkId = network == -104 ? 144 : 104;
        const networkId = network == -104 ? 152 : 104;
        return (`44'/43'/${networkId}'/${index}/0`);
    }

    async createAccount(network, index, label) {
        const transport = await TransportWebUSB.create()
            .catch(err => console.log(err));
        const nemH = new NemH(transport);
        const hdKeypath = this.bip44(network, index);
        return nemH.getAddress(hdKeypath)
            .then(result => ({
                "brain": false,
                "algo": "trezor",
                "encrypted": "",
                "iv": "",
                "address": result.address,
                "label": label,
                "network": network,
                "child": "",
                "hdKeypath": hdKeypath
            }))
            .catch(err => console.log(err));
    }

    deriveRemote(account, network) {
    }

    serialize(transaction, account) {
    }

    showAccount(account) {
    }

    // End methods region //

}

export default Ledger;
