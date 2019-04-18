import ledgerService from "../../src/app/modules/ledger/ledger.service";

describe("Ledger service", function() {
  let ledger;
  beforeEach(angular.mock.module('app'));

  beforeAll(function() {
    ledger = new ledgerService;
  });

  it ("Create bip44 path for testnet NetWork", function() {
    expect("44'/43'/152'/0'/0'").toBe(ledger.bip44(-104, 0));
  });

  it ("Create bip44 path for main NetWork", function() {
    expect("44'/43'/104'/0'/0'").toBe(ledger.bip44(104, 0));
  });

  it ("Create an account", function() {
    
  });
});

   