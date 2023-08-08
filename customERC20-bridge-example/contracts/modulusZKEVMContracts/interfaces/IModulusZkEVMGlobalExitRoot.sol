// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.8.17;
import "./IBaseModulusZkEVMGlobalExitRoot.sol";

interface IModulusZkEVMGlobalExitRoot is IBaseModulusZkEVMGlobalExitRoot {
    function getLastGlobalExitRoot() external view returns (bytes32);
}
