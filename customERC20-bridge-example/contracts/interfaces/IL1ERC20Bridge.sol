// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IL1ERC20Bridge {

    function bridgeToken(
        address destinationAddress,
        uint256 amount,
        bool forceUpdateGlobalExitRoot
    ) external;

    // function onMessageReceived(
    //     address originAddress,
    //     uint32 originNetwork,
    //     bytes memory data
    // ) external payable;

}
