import NemH from "./hw-app-nem";
import TransportWebUSB from "./hw-transport-webusb";
import nem from "nem-sdk";

// var nemH;

/** Service storing Ledger utility functions. */
class Ledger {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Alert) {
        'ngInject';

        // Service dependencies region //

        this._Alert = Alert;

        // End dependencies region //

        // Service properties region //

        // End properties region //

        // Initialization
        this.init();
    }

    /**
     * Initialize module properties
     */

    init() {
        // The connection between Nano Wallet and Ledger Device
        this.nemH = undefined;
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
            .catch(err => {
                throw err;
            });
    }

    bip44(network, index) {
        // recognize networkId by bip32Path;
        // "44'/43'/networkId'/walletIndex'/accountIndex'"
        const networkId = network == -104 ? 152 : 104;
        return (`44'/43'/${networkId}'/${index}'/0'`);
    }

    async createAccount(network, index, label) {
        const transport = await TransportWebUSB.create()
            .catch(err => {
                throw err.message;
            });
        this.nemH = new NemH(transport);

        const hdKeypath = this.bip44(network, index);
        return this.nemH.getAddress(hdKeypath)
            .then(result => {
                return ({
                    "brain": false,
                    "algo": "ledger",
                    "encrypted": "",
                    "iv": "",
                    "address": result.address,
                    "label": label,
                    "network": network,
                    "child": "",
                    "hdKeypath": hdKeypath,
                    "publicKey": result.publicKey
                })
            })
            .catch(err => {
                throw err;
            });
    }

    deriveRemote(account, network) {}

    serialize(transaction, account) {
        return new Promise((resolve, reject) => {
            //Transaction with testnet and mainnet
            //Correct the signer
            transaction.signer = account.publicKey;

            //If it is a MosaicDefinition Creation Transaction, then correct the creator
            if (transaction.type == 0x4001) {
                transaction.mosaicDefinition.creator = account.publicKey;
            }

            //Serialize the transaction
            let serializedTx = nem.utils.convert.ua2hex(nem.utils.serialization.serializeTransaction(transaction));

            this.nemH.signTransaction(account.hdKeypath, serializedTx)
                .then(sig => {
                    let payload = {
                        data: serializedTx,
                        signature: sig.signature
                    }
                    resolve(payload);
                })
                .catch(err => {
                    this._Alert.createWalletFailed(err);
                    reject(err);
                });
        });
    }

    showAccount(account) {}

    // End methods region //

}

export default Ledger;