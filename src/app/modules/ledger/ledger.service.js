import NemH from "./hw-app-nem";
import TransportWebUSB from "./hw-transport-webusb";
import {
    NEMLibrary, NetworkTypes, Account, TransferTransaction, TimeWindow,
    TransactionHttp, XEM, PublicAccount
} from "nem-library";

const nemSDK = require("nem-sdk").default;
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
        return nemH.getAddress(hdKeypath)
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
            })})
            .catch(err => console.log(err));
    }

    deriveRemote(account, network) {
    }

    serialize(transaction, account) {
        return new Promise((resolve, reject) => {
            //Transaction with testnet and mainnet

            //serialize the transaction
            let serializedTx    = nemSDK.utils.convert.ua2hex(nemSDK.utils.serialization.serializeTransaction(transaction));

            //Replace publicKey by new publicKey
            let signingBytes    = serializedTx.slice(0, 32) + account.publicKey + serializedTx.slice(32 + 64, serializedTx.length);

            nemH.signTransaction(account.hdKeypath, signingBytes)
            .then(sig => {
                let payload = {
                    data: signingBytes,
                    signature: sig.signature
                }
                resolve(payload);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    showAccount(account) {
    }

    // End methods region //

}

export default Ledger;
