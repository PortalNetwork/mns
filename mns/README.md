# MNS

Implementations for smart contracts for the Quarkchain Name Service.

## Techincal Stack
- Use `truffle` to create, compile, deploy and test smart contract.
- Use `open zeppelin` for smart contract security.
- Use `ganache-cli` for local testing.

## Install the project dependency

Install `truffle` and `ganache-cli`
```
npm install -g truffle
npm install -g ganache-cli
```

## Local testing

Testing with `truffle`
```
truffle test
```

## Solidity coverage

Get a repost of the Solidity code testing coverage.

Install
```
npm install -g mkdirp
npm install --save-dev solidity-coverage
```

Run solidity coverage
```
./node_modules/.bin/solidity-coverage
```

## MNSRegistry.sol
Implementation of the MNS registry, the central contract used to look up resolvers and owners for domains.

## MNSRegistrar.sol
Implementation of the MNS registrar, which issues (sub-)domains to the first account to request them.

## MNSResolver.sol
Implementation of the MNS resolver that allows the owner of any domain to configure how its name should resolve.

