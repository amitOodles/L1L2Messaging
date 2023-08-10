// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "../interfaces/IL1ERC20Bridge.sol";
import "../ERC20BridgeNativeChain.sol";

contract L1ERC20Bridge is ERC20BridgeNativeChain {

    mapping(bytes4 => bool) internal supportedInterfaces;

    function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
        return supportedInterfaces[interfaceID];
    }

    function bridgeToken(
        address destinationAddress,
        uint256 amount,
        bool forceUpdateGlobalExitRoot
    ) public virtual override(ModulusERC20BridgeLib)  {
        super.bridgeToken(destinationAddress, amount, forceUpdateGlobalExitRoot);
    }

    function onMessageReceived(
        address originAddress,
        uint32 originNetwork,
        bytes memory data
    ) external payable override {
        super.onMessageReceived(originAddress, originNetwork, data);
    }
} 