import nem from 'nem-sdk';

class LedgerCtrl {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(AppConstants, $timeout, Alert, Login, Ledger) {
        'ngInject';

        //// Module dependencies region ////

        this._AppConstants = AppConstants;
        this._$timeout = $timeout;
        this._Alert = Alert;
        this._Login = Login;
        this._Ledger = Ledger;

        //// End dependencies region ////

        //// Module properties region ////

        /**
         * Default network
         *
         * @type {number}
         */
        this.network = this._AppConstants.defaultNetwork;

        /**
         * Available networks
         *
         * @type {object} - An object of objects
         */
        this.networks = nem.model.network.data;

        //// End properties region ////
    }

    //// Module methods region ////

    /**
     * Change wallet network
     *
     * @param {number} id - The network id to use at wallet creation
     */
    changeNetwork(id) {
        if (id == nem.model.network.data.mijin.id && this._AppConstants.mijinDisabled) {
            this._Alert.mijinDisabled();
            // Reset network to default
            this.network = this._AppConstants.defaultNetwork;
            return;
        } else if (id == nem.model.network.data.mainnet.id && this._AppConstants.mainnetDisabled) {
            this._Alert.mainnetDisabled();
            // Reset network to default
            this.network = this._AppConstants.defaultNetwork;
            return;
        }
        // Set Network
        this.network = id;
    }

    /**
     * Login with LEDGER
     */
    login() {
        this._Ledger.createWallet(this.network)
        .then( wallet => {
            console.log(wallet);
            console.log("valid address: " + nem.model.address.isValid(wallet.accounts[0].address));
            this._Login.login({}, wallet);
        })
        .catch(error => {
            this._$timeout(() => {
                this._Alert.createWalletFailed(error);
            });
        });
    }


    //// End methods region ////

}

export default LedgerCtrl;
