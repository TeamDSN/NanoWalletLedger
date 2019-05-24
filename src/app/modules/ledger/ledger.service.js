import NemH from "./hw-app-nem";
import TransportWebUSB from "./hw-transport-webusb";
import nem from "nem-sdk";

var nemH;

/** Service storing Ledger utility functions. */
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
        const networkId = network == -104 ? 152 : 104;
        return (`44'/43'/${networkId}'/${index}'/0'`);
    }

    async createAccount(network, index, label) {
        const transport = await TransportWebUSB.create()
        .catch(err => console.log(err));

        nemH = new NemH(transport);
        const hdKeypath = this.bip44(network, index);
        const result = await this.getAccount(hdKeypath, network, label);
        return result;
    }

    deriveRemote(account, network) {
    }

    serialize(transaction, account) {
        return new Promise(async (resolve, reject) => {
            //Transaction with testnet and mainnet
            //Correct the signer
            transaction.signer = account.publicKey;

            //If it is a MosaicDefinition Creation Transaction, then correct the creator
            if (transaction.type == 0x4001) {
                transaction.mosaicDefinition.creator = account.publicKey;
            }

            //Serialize the transaction
            let serializedTx    = nem.utils.convert.ua2hex(nem.utils.serialization.serializeTransaction(transaction));

            let payload = await this.signTransaction(account, serializedTx);
            resolve(payload);
        });
    }

    showAccount(account) {
    }

    async getAccount(hdKeypath, network, label) {
        let result = await nemH.getAddress(hdKeypath)
        .catch(err => console.log(err));
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
        let sig = await nemH.signTransaction(account.hdKeypath, serializedTx)
        .catch(err => {
            console.error('Error: ' + err);
            return null;
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
