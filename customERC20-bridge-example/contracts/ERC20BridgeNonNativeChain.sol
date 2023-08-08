// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.8.17;

import "./lib/ModulusERC20BridgeLib.sol";
import "./interfaces/IERC20Wrapped.sol";

/**
 * ERC20BridgeNonNativeChain is an example contract to use the message layer of the ModulusZkEVMBridge to bridge custom ERC20
 * This contract will be deployed on the non-native erc20 network (usually will be zk-EVM)
 */
contract ERC20BridgeNonNativeChain is ModulusERC20BridgeLib {
    // Token address
    IERC20Wrapped public immutable token;

    /**
     * @param _modulusZkEVMBridge Modulus zkevm bridge address
     * @param _counterpartContract Couterpart contract
     * @param _counterpartNetwork Couterpart network
     * @param _token Token address
     */
    constructor(
        IModulusZkEVMBridge _modulusZkEVMBridge,
        address _counterpartContract,
        uint32 _counterpartNetwork,
        IERC20Wrapped _token
    )
        ModulusERC20BridgeLib(
            _modulusZkEVMBridge,
            _counterpartContract,
            _counterpartNetwork
        )
    {
        token = _token;
    }

    /**
     * @dev Handle the reception of the tokens
     * @param amount Token amount
     */
    function _receiveTokens(uint256 amount) internal override {
        token.bridgeBurn(msg.sender, amount);
    }

    /**
     * @dev Handle the transfer of the tokens
     * @param destinationAddress Address destination that will receive the tokens on the other network
     * @param amount Token amount
     */
    function _transferTokens(
        address destinationAddress,
        uint256 amount
    ) internal override {
        token.bridgeMint(destinationAddress, amount);
    }
}
