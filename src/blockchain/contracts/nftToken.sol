// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;


interface ERC20 {
    function balanceOf(address _owner) external returns (uint256 balance);
    function transfer(address _to, uint256 value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}


contract nftToken is ERC20 {
    uint totalSupply;
    string public symbol;
    string public  name;
    uint8 public decimals;
    mapping (uint => address) public owners;
    uint public ownerCount;

    constructor(address _mintAddress) {
        symbol = "nftT";
        name = "nftToken";
        totalSupply = 100;
        balances[_mintAddress] = totalSupply;
        owners[ownerCount++] = _mintAddress;
    }

    mapping (address => uint) balances;
    mapping (address => mapping (address => uint) ) allowances;


    function balanceOf(address _owner) public view returns (uint) {
        return balances[_owner];
    }
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowances[_owner][_spender];
    }

     function approve(address _spender, uint256 _value) public returns (bool success) {
         require(balanceOf(msg.sender)>=_value);
         allowances[msg.sender][_spender] = _value;
        return true;
     }
  function transfer(address _to, uint value) public returns (bool success) {
      require(balanceOf(msg.sender)>=value);
      balances[msg.sender] -= value;
      balances[_to] += value;
      if(balanceOf(_to)==value) {
      owners[ownerCount++] = _to;}
      return true;
  }
    
    function transferFrom(address _from, address _to, uint256 value) public returns (bool success)
 {
    require(balanceOf(_from)>=value);
    require(allowance(_from,msg.sender)>=value);
      balances[_from] -= value;
      balances[_to] += value;
      allowances[_from][msg.sender] -= value;
      if(balanceOf(_to)==value) {
      owners[ownerCount++] = _to;}
      return true;
 } 
    


}
