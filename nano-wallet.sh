#!/bin/bash
cd external-modules/ledger-bridge
npm install
cd ../../
npm run devApp &
cd external-modules/ledger-bridge
npm run serve
