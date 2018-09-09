const MNSRegistrar = artifacts.require('MNSRegistrar.sol');
const MNSRegistry = artifacts.require('MNSRegistry.sol');
const MNSResolver = artifacts.require('MNSResolver.sol');
const MithrilToken = artifacts.require('MithrilToken.sol');
const namehash = require('eth-ens-namehash');
const Web3 = require('web3');
let web3 = new Web3();

contract('MNS', function (accounts) {

  let registry, registrar, resolver, mithril;

  beforeEach(async () => {
    /*mithril = await MithrilToken.new();
    registry = await MNSRegistry.new();
    registrar = await MNSRegistrar.new(registry.address, mithril.address, namehash.hash('mith'));
    resolver = await MNSResolver.new(registry.address);

    await registry.setOwner(0, registrar.address, {from: accounts[0]});*/
  });

  it('should init mithril token', async () => {
    mithril = await MithrilToken.new();
    await mithril.init(1000000000000000000000000000, accounts[0], accounts[0]);
    assert.equal(await mithril.totalSupply(), 1000000000000000000000000000);

    await mithril.transfer(accounts[5], 10000000000000000000000000);
    assert.equal(await mithril.balanceOf(accounts[5]), 10000000000000000000000000);

    //await mithril.approve(accounts[0], 100, {from : accounts[5]});
    //console.log(await mithril.allowance(accounts[5], accounts[0]));

  })

  it('should allow registration of names', async () => {
    // MITH 
    mithril = await MithrilToken.new();
    await mithril.init(1000000000000000000000000000, accounts[0], accounts[0]);
    assert.equal(await mithril.totalSupply(), 1000000000000000000000000000);

    await mithril.transfer(accounts[5], 10000000000000000000000000);
    assert.equal(await mithril.balanceOf(accounts[5]), 10000000000000000000000000);

    // MNS
    registry = await MNSRegistry.new();
    registrar = await MNSRegistrar.new(registry.address, mithril.address, namehash.hash('mith'), accounts[3]);
    await registry.setSubnodeOwner(0x0, web3.sha3('mith'), registrar.address, {from: accounts[0]});
    assert.equal(await registry.owner(namehash.hash('mith')), registrar.address);

    // approve
    await mithril.approve(registrar.address, 100, '', {from: accounts[5]});
    assert.equal((await mithril.allowance.call(accounts[5], registrar.address)).toNumber(), 100);

    // MNS Register
    await registrar.register('hello', accounts[1], {from: accounts[5]});
    assert.equal(await registry.owner(namehash.hash('hello.mith')), accounts[1]);

    assert.equal((await mithril.balanceOf(accounts[3])).toNumber(), 100);
    //await registry.setSubnodeOwner(namehash.hash('mith'), web3.sha3('subdomain'), accounts[1], {from: accounts[1]});
    //assert.equal(await registry.owner(namehash.hash('subdomain.mith')), accounts[1]);
    //console.log(await registry.owner('mith'), registrar.address);
    
    //await registrar.register('mith', accounts[0], {from: accounts[0]});
    //console.log(await registry.owner('mith'), registrar.address);
    //assert.equal(await registry.owner(0), registrar.address);
    //assert.equal(await registry.owner('mith', accounts[0]));
  });

  it.skip('should register a domain', async () => {
    await registrar.register(web3.sha3('mith'), accounts[1], {from: accounts[1]});
    assert.equal(await registry.owner(namehash.hash('mith')), accounts[1]);
    // register a subdomain
    await registry.setSubnodeOwner(namehash.hash('mith'), web3.sha3('subdomain'), accounts[1], {from: accounts[1]});
    assert.equal(await registry.owner(namehash.hash('subdomain.mith')), accounts[1]);
  });

  it.skip('should check resolver interfaces', async () => {
    assert.equal(await resolver.supportsInterface('0x3b3b57de'), true);
    assert.equal(await resolver.supportsInterface('0xd8389dc5'), true);
    assert.equal(await resolver.supportsInterface('0x691f3431'), true);
    assert.equal(await resolver.supportsInterface('0xe89401a1'), true);
    assert.equal(await resolver.supportsInterface('0x59d1d43c'), true);
  });

  it.skip('should not support a random interface', async () => {
    assert.equal(await resolver.supportsInterface('0x3b3b57df'), false);
  });

  it.skip('should set resolver for node', async () => {
    await registrar.register(web3.sha3('mith'), accounts[1], {from: accounts[1]});
    await registry.setSubnodeOwner(namehash.hash('mith'), web3.sha3('subdomain'), accounts[1], {from: accounts[1]});
    await registry.setResolver(namehash.hash('mith'), resolver.address, {from: accounts[1]});
    assert.equal(await registry.resolver(namehash.hash('mith')), resolver.address);
  });

  it.skip('should set text', async () => {
    await registrar.register(web3.sha3('mith'), accounts[1], {from: accounts[1]});
    await registry.setSubnodeOwner(namehash.hash('mith'), web3.sha3('subdomain'), accounts[1], {from: accounts[1]});
    await registry.setResolver(namehash.hash('mith'), resolver.address, {from: accounts[1]});
    await resolver.setText(namehash.hash('mith'), 'MNS', 'TomoChain Name Service', {from: accounts[1]});
    assert.equal(await resolver.text(namehash.hash('mith'), 'MNS'), 'TomoChain Name Service');
  }); 

  it.skip('should set address', async () => {
    await registrar.register(web3.sha3('mith'), accounts[1], {from: accounts[1]});
    await registry.setSubnodeOwner(namehash.hash('mith'), web3.sha3('subdomain'), accounts[1], {from: accounts[1]});
    await registry.setResolver(namehash.hash('mith'), resolver.address, {from: accounts[1]});
    await resolver.setAddr(namehash.hash('mith'), accounts[1], {from: accounts[1]});
    assert.equal(await resolver.addr(namehash.hash('mith')), accounts[1]);
  });

  it.skip('should set multihash', async () => {
    await registrar.register(web3.sha3('mith'), accounts[1], {from: accounts[1]});
    await registry.setSubnodeOwner(namehash.hash('mith'), web3.sha3('subdomain'), accounts[1], {from: accounts[1]});
    await registry.setResolver(namehash.hash('mith'), resolver.address, {from: accounts[1]});
    await resolver.setMultihash(namehash.hash('mith'), 'IPFS', '0x0000000000000000000000000000000000123456', {from: accounts[1]});
    assert.equal(await resolver.multihash(namehash.hash('mith'), 'IPFS'), '0x0000000000000000000000000000000000123456');
  });
});
