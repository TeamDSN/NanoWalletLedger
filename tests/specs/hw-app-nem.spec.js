import HwLedger from "../../src/app/modules/ledger/hw-app-nem";
import TransportWebUSB from "../../src/app/modules/ledger/hw-transport-webusb";
import nem from "nem-sdk";

describe("Ledger JS connector library", function() {

    let hwLedger, transport;

    beforeEach(function() {
        angular.mock.module('app');

        transport = jasmine.createSpyObj('TransportWebUSB', [ 'decorateAppAPIMethods', 'send' ]);
        transport.decorateAppAPIMethods.and.callFake(function() {
            return 'test';
        });

        hwLedger = new HwLedger(transport);
     });

    it ("Can get address from path", async (done) => {
        // GIVEN
        transport.send.and.callFake(function() {
            return Promise.resolve([
                40,84,65,53,52,53,73,67,65,86,78,69,85,68,70,85,66,73,72,79,
                51,67,69,74,66,83,86,73,90,55,89,89,72,70,70,88,53,76,81,80,
                84,32,62,110,108,186,196,136,184,164,75,223,90,191,39,185,225,
                204,42,111,32,208,157,85,10,102,185,179,111,82,92,162,34,238,144,0
            ]);
        });
        let expectedResult = {
            address:"84,65,53,52,53,73,67,65,86,78,69,85,68,70,85,66,73,72,79,51,67,69,74,66,83,86,73,90,55,89,89,72,70,70,88,53,76,81,80,84",
            publicKey:"62,110,108,186,196,136,184,164,75,223,90,191,39,185,225,204,42,111,32,208,157,85,10,102,185,179,111,82,92,162,34,238",
            path:"44'/43'/152'/0'/0'"
        }

        // WHEN
        let result = await hwLedger.getAddress("44'/43'/152'/0'/0'");

        // THEN
        expect(transport.send).toHaveBeenCalled();
        expect(expectedResult).toEqual(result);
        done();
    });

    it ("Can sign transaction", async (done) => {
        // GIVEN
        let bip32path = "44'/43'/152'/0'/0'";
        let rawTxHex = '010100000100009852c7d507200000003e6e6cbac488b8a44bdf5abf27b9e1cc2a6f20d09d550a66b9b36f525' +
        'ca222eea08601000000000062d5d507280000005441353435494341564e45554446554249484f3343454a425356495a375959484' +
        '64658354c51505440420f000000000018000000010000001000000074657374207472616e73616374696f6e';

        let apduCla = 224;
        let apduIns = 4;
        let apduP1 = 144;
        let apduP2 = 128;
        let apduData = "�,�+�����R�� >nl�Ĉ��K�Z�'���*o НU\n" +
        'f��oR\�"b��(TA545ICAVNEUDFUBIHO3CEJBSVIZ7YYHFFX5LQPT@Btest transaction';

        let mockSendResponse = nem.utils.convert.hex2ua('7ce4130d176b3e34922775271d73a28a40400fff63bbe51370159de44' +
        '52d25b40f2e8b4088dd3da1a88a0be9b37f034f10fde7ad77d5eb44be422f168ed1130e203e6e6cbac488b8a44bdf5abf27b9e1cc' +
        '2a6f20d09d550a66b9b36f525ca222ee9000');
        
        let expectedResult = {
            signature:"124,228,19,13,23,107,62,52,146,39,117,39,29,115,162,138,64,64,15,255,99,187,229,19,112,21,157,228,69,45,37,180,15,46,139,64,136,",
            publicKey:"1,61,161,168,138,11,233,179,127,3,79,16,253,231,173,119,213,235,",
            path:"44'/43'/152'/0'/0'"
        }
        transport.send.and.callFake(function() {
            apduData = arguments[4];
            return Promise.resolve(mockSendResponse);
        });

        // WHEN
        let result = await hwLedger.signTransaction(bip32path, rawTxHex);

        // THEN
        expect(transport.send).toHaveBeenCalledWith(apduCla, apduIns, apduP1, apduP2, apduData);
        expect(expectedResult).toEqual(result);
        done();
    });

    it ("Can get app configuration", async (done) => {
        // GIVEN
        let mockSendResponse = ['res0', 'res1', 'res2', 'res3'];
        let expectedResult = {version: 'res1.res2.res3'};
        transport.send.and.callFake(function() {
            return Promise.resolve(mockSendResponse);
        });

        // WHEN
        let result = await hwLedger.getAppConfiguration();

        //THEN
        expect(transport.send).toHaveBeenCalledWith(0xe0, 0x06, 0x00, 0x00);
        expect(expectedResult).toEqual(result);
        done();
    });
});