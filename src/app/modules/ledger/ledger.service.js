import NemH from "./hw-app-nem";
import TransportWebUSB from "./hw-transport-webusb";
import nem from "nem-sdk";

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
        return new Promise((resolve, reject) => {
            const popname = window.open("http://localhost:8080/getWallet/" + network, "popname", "status=1, height=600, width=800, toolbar=0,resizable=0");
            popname.window.focus();

            window.addEventListener("message", function(ev) {
                if (ev.data.message === "getAccountResult") {
                    resolve(ev.data.result);
                } else if (ev.data.message === "cannotGetAccount") {
                    reject(ev.data.result.message);
                } else if (ev.data.message === "deniedByTheUser") {
                    reject(ev.data.result);
                }
            });
        })
    }

    bip44(network, index) {
        // recognize networkId by bip32Path;
        // "44'/43'/networkId'/walletIndex'/accountIndex'"
        const networkId = network == -104 ? 152 : 104;
        return (`44'/43'/${networkId}'/${index}'/0'`);
    }

    async createAccount(network, index, label) {
        const hdKeypath = this.bip44(network, index);
        const result = await this.getAccount(hdKeypath, network, label);
        return result;
    }

    deriveRemote(account, network) {}

    serialize(transaction, account) {
        return new Promise(async(resolve, reject) => {
            //Transaction with testnet and mainnet
            //Correct the signer
            transaction.signer = account.publicKey;

            //If it is a MosaicDefinition Creation Transaction, then correct the creator
            if (transaction.type == 0x4001) {
                transaction.mosaicDefinition.creator = account.publicKey;
            }

            //Serialize the transaction
            let serializedTx = nem.utils.convert.ua2hex(nem.utils.serialization.serializeTransaction(transaction));

            let payload = await this.signTransaction(account, serializedTx)
                .catch(err => {
                    this._Alert.createWalletFailed(err);
                    reject(err);
                });
            resolve(payload);
        });
    }

    showAccount(account) {}

    async getAccount(hdKeypath, network, label) {
        const transport = await TransportWebUSB.create()
            .catch(err => {
                throw err.message;
            });

        this.nemH = new NemH(transport);

        let result = await this.nemH.getAddress(hdKeypath)
            .catch(err => {
                throw err;
            });
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
    }

    async signTransaction(account, serializedTx) {
        let sig = await this.nemH.signTransaction(account.hdKeypath, serializedTx)
            .catch(err => {
                throw err;
            });

        let payload = {
            data: serializedTx,
            signature: sig.signature
        }
        return payload;
    }

    // End methods region //

}

export default Ledger;