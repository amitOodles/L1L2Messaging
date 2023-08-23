// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.8.17;

import "../modulusZKEVMContracts/interfaces/IBaseModulusZkEVMGlobalExitRoot.sol";
import "../modulusZKEVMContracts/interfaces/IBridgeMessageReceiver.sol";
import "../modulusZKEVMContracts/interfaces/IModulusZkEVMBridge.sol";

/**
 * This contract contains the logic to use the message layer of the bridge to send and receive messages
 * to a counterpart contract deployed on another network.
 * Is needed to deploy 1 contract on each layer that inherits this library.
 */
abstract contract ModulusBridgeLib {
    // Zk-EVM Bridge address
    IModulusZkEVMBridge public immutable modulusZkEVMBridge;

    // Counterpart contract that will be deployed on the other network
    // Both contract will send messages to each other
    address public immutable counterpartContract;

    // Counterpart network
    uint32 public immutable counterpartNetwork;

    /**
     * @param _modulusZkEVMBridge Modulus zkevm bridge address
     * @param _counterpartContract Couterpart contract
     * @param _counterpartNetwork Couterpart network
     */
    constructor(
        IModulusZkEVMBridge _modulusZkEVMBridge,
        address _counterpartContract,
        uint32 _counterpartNetwork
    ) {
        modulusZkEVMBridge = _modulusZkEVMBridge;
        counterpartContract = _counterpartContract;
        counterpartNetwork = _counterpartNetwork;
    }

    /**
     * @notice Send a message to the bridge
     * @param messageData Message data
     * @param forceUpdateGlobalExitRoot Indicates if the global exit root is updated or not
     */
    function _bridgeMessage(
        bytes memory messageData,
        bool forceUpdateGlobalExitRoot
    ) internal virtual {
        modulusZkEVMBridge.bridgeMessage(
            counterpartNetwork,
            counterpartContract,
            forceUpdateGlobalExitRoot,
            messageData
        );
    }

    /**
     * @notice Function triggered by the bridge once a message is received by the other network
     * @param originAddress Origin address that the message was sended
     * @param originNetwork Origin network that the message was sended ( not usefull for this contract)
     * @param data Abi encoded metadata
     */
    function onMessageReceived(
        address originAddress,
        uint32 originNetwork,
        bytes memory data
    ) public virtual payable {
        // Can only be called by the bridge
        require(
            msg.sender == address(modulusZkEVMBridge),
            "TokenWrapped::ModulusBridgeLib: Not ModulusZkEVMBridge"
        );

        require(
            counterpartContract == originAddress,
            "TokenWrapped::ModulusBridgeLib: Not counterpart contract"
        );
        require(
            counterpartNetwork == originNetwork,
            "TokenWrapped::ModulusBridgeLib: Not counterpart network"
        );

        _onMessageReceived(data);
    }

    /**
     * @dev Handle the data of the message received
     * Must be implemented in parent contracts
     */
    function _onMessageReceived(bytes memory data) internal virtual;
}
