// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.9;

// import "./VestingManager.sol";

// contract VestingFactory {
//     VestingManager[] public lockSchedules;

//     function createLockSchedule(
//         address _beneficiaryAddress,
//         uint64 _startTimestamp,
//         uint64 _durationSeconds
//     ) external returns (address lockedSchedule) {
//         VestingManager schedule = new VestingManager(
//             _beneficiaryAddress,
//             _startTimestamp,
//             _durationSeconds
//         );
//         lockedSchedule = address(schedule);
//     }
// }
