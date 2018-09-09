pragma solidity ^0.4.18;

import './MNS.sol';
import './MithrilToken.sol';

/**
 * A registrar that allocates subdomains to the first person to claim them.
 */
contract MNSRegistrar {
    MNS mns;
    MithrilToken mithrilToken;
    bytes32 rootNode;
    address wallet;

    event Register(string subnode, address owner);

    modifier only_owner(string subnode) {
        address currentOwner = mns.owner(keccak256(rootNode, keccak256(subnode)));
        require(currentOwner == 0 || currentOwner == msg.sender);
        _;
    }

    /**
     * Constructor.
     */
    function MNSRegistrar(MNS mnsAddr, MithrilToken mithrilTokenAddr, bytes32 node, address _wallet) public {
        mns = mnsAddr;
        mithrilToken = mithrilTokenAddr;
        rootNode = node;
        wallet = _wallet;
    }

    /**
     * Register a name, or change the owner of an existing registration.
     * @param subnode The hash of the label to register.
     * @param owner The address of the new owner.
     */
    function register(string subnode, address owner) public only_owner(subnode) {
        mithrilToken.transferFrom(msg.sender, address(this), 100);
        mithrilToken.transfer(wallet, 100);
        mns.setSubnodeOwner(rootNode, keccak256(subnode), owner);
        emit Register(subnode, owner);
    }

    /**
     * Process
     * 1. User send MithrilToken approve to MNSRegistrar
     * 2. User send MNSRegistrar register claim MNS
     */
}