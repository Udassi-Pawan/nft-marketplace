// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface ERC20 {
    function balanceOf(address _owner) external returns (uint256 balance);
    function transfer(address _to, uint256 value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function increaseAllowance(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract Token is ERC20 {
    uint totalSupply;
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public exchangeRate;


    constructor(uint _totalSupply, string memory _name, string memory _symbol,uint _exChangeRate, address _mintAddress) {
        symbol = _symbol;
        name = _name;
        totalSupply = _totalSupply;
        exchangeRate = _exChangeRate;
        balances[_mintAddress] = _totalSupply;
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
     
     function increaseAllowance (address _spender, uint256 _value) public returns (bool success) {
         require(balanceOf(msg.sender)>=_value);
         allowances[msg.sender][_spender] += _value;
        return true;
     }
     
  function transfer(address _to, uint value) public returns (bool success) {
      require(balanceOf(msg.sender)>=value);
      balances[msg.sender] -= value;
      balances[_to] += value;
      return true;
  }
    function transferFrom(address _from, address _to, uint256 value) public returns (bool success)
 {
    require(balanceOf(_from)>=value);
    require(allowance(_from,msg.sender)>=value);
      balances[_from] -= value;
      balances[_to] += value;
      allowances[_from][msg.sender] -= value;
      return true;
 } 

}

contract DEX1 {
 Token public bidToken ;
 constructor() {
        bidToken = new Token(10000000000000000000000000,"bidToken","bd",1,address(this));
    }
    function buy () payable public {
        uint exR = bidToken.exchangeRate();
        uint amountTobuy = msg.value;
        uint tokenAmount = amountTobuy*exR;
        uint dexBalance = bidToken.balanceOf(address(this));
        require(amountTobuy>0);
        require(dexBalance>=tokenAmount);
        bidToken.transfer(msg.sender,tokenAmount);
    }
    function sell(uint amount) public {
            require(amount > 0, "You need to sell at least some tokens");
            uint256 allowance = bidToken.allowance(msg.sender, address(this));
            require(allowance>=amount);
            bidToken.transferFrom(msg.sender,address(this),amount);
    }
}
