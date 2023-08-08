// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract ERC165MappingImplementation  is IERC165 {
    /// @dev You must not set element 0xffffffff to true
    mapping(bytes4 => bool) internal _supportedInterfaces;

    constructor() {
        _supportedInterfaces[IERC165.supportsInterface.selector] = true;
    }

    function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
        return _supportedInterfaces[interfaceID];
    }
}