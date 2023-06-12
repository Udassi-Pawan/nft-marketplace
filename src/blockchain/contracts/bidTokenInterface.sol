// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;


interface tokenParentInterface {
    function balanceOf(address _owner) external returns (uint256 balance);
    function transfer(address _to, uint256 value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function increaseAllowance(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

interface bidTokenInterface {
     function buy () payable  external ;
    function sell(uint amount) payable  external ;
    function bidToken() external  returns (address)  ;
}