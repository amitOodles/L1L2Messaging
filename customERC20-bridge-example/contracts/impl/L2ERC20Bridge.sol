// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "../interfaces/IL1L2ERC20Bridge.sol";
import "../ERC20BridgeNonNativeChain.sol";

contract L2ERC20Bridge is IERC165, IL1L2ERC20Bridge, ERC20BridgeNonNativeChain {

    mapping(bytes4 => bool) internal supportedInterfaces;

    constructor(
        IModulusZkEVMBridge _modulusZkEVMBridge,
        address _counterpartContract,
        uint32 _counterpartNetwork,
        IERC20Wrapped _token
    ) ERC20BridgeNonNativeChain(_modulusZkEVMBridge, _counterpartContract, _counterpartNetwork, _token){
        supportedInterfaces[IERC165.supportsInterface.selector] = true;
        supportedInterfaces[IL1L2ERC20Bridge.bridgeToken.selector ^ IL1L2ERC20Bridge.onMessageReceived.selector] = true;
    }

    function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
        return supportedInterfaces[interfaceID];
    }

    function bridgeToken(
        address destinationAddress,
        uint256 amount,
        bool forceUpdateGlobalExitRoot
    ) public override(IL1L2ERC20Bridge, ModulusERC20BridgeLib)  {
        super.bridgeToken(destinationAddress, amount, forceUpdateGlobalExitRoot);
    }

    function onMessageReceived(
        address originAddress,
        uint32 originNetwork,
        bytes memory data
    ) public payable override (IL1L2ERC20Bridge, ModulusBridgeLib) {
        super.onMessageReceived(originAddress, originNetwork, data);
    }
} 