const MNSRegistry = artifacts.require("./MNSRegistry.sol");
const MNSRegistrar = artifacts.require('./MNSRegistrar.sol');
const MNSResolver = artifacts.require('./MNSResolver.sol');
const MithrilToken = artifacts.require('./MithrilToken.sol');

const web3 = new (require('web3'))();
const namehash = require('eth-ens-namehash');

const MITH = 'mith';

module.exports = async (deployer) => {
  // deploy mithril token
  let mithrilToken = await deployer.deploy(MithrilToken);
  // deploy registry
  let mnsResgirty = await deployer.deploy(MNSRegistry);
  // deploy registrar
  let mnsRegistrar = await deployer.deploy(MNSRegistrar, MNSRegistry.address, MithrilToken.address, namehash.hash(MITH), 0x0);
  // deploy resolver
  let mnsResolver = await deployer.deploy(MNSResolver, MNSRegistry.address);
  MNSRegistry.at(MNSRegistry.address).setSubnodeOwner('0x0', web3.sha3(MITH), MNSRegistrar.address);
};
