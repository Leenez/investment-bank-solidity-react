pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InvestmentBank is Ownable {

    using SafeMath for uint;

    mapping(address => mapping(bytes32 => Deposit)) internal deposits;

    mapping(bytes32 => Token) internal tokenMapping;

    bytes32[] internal tokenList;
    
    address public interestTokenAddress;

    modifier tokenExists(bytes32 ticker) {
        require(tokenMapping[ticker].tokenAddress != address(0));
        _;
    }

    struct Deposit {
        uint depositTime;
        uint depositValue;
    }

    struct Token {
        address tokenAddress;
        uint tokenInterest;
    }

    // Owner can add new tokens to the bank.
    function addToken(bytes32 ticker, address tokenAddress, uint tokenInterest) onlyOwner external {
        tokenMapping[ticker] = Token(tokenAddress, tokenInterest);
        tokenList.push(ticker);
    }

    // Users can deposit tokens that have been added to the bank.
    function deposit(bytes32 ticker, uint amount) external tokenExists(ticker) {
        require(IERC20(tokenMapping[ticker].tokenAddress).balanceOf(msg.sender) >= amount);
        uint alreadyDeposited = deposits[msg.sender][ticker].depositValue;
        deposits[msg.sender][ticker] = Deposit(block.timestamp, alreadyDeposited.add(amount));
        IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
    }

    // Users can withdraw tokens and the interest is paid at the time of withdrawal.
    function withdraw(bytes32 ticker, uint amount) external tokenExists(ticker) {
        require(deposits[msg.sender][ticker].depositValue >= amount);
        uint interest = calculateInterest(ticker, amount);
        require(IERC20(interestTokenAddress).balanceOf(address(this)) >= interest);
        deposits[msg.sender][ticker].depositValue = deposits[msg.sender][ticker].depositValue.sub(amount);
        IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);
        IERC20(interestTokenAddress).transfer(msg.sender, interest);
    }

    // Owner can change the address for interest token.
    function setInterestTokenAddress(address _address) external onlyOwner{
        interestTokenAddress = _address;
    }

    // This function calculates the amount of interest tokens paid at the time of withdrawal.
    function calculateInterest(bytes32 ticker, uint amount) internal view returns(uint) {
        uint depositTime = deposits[msg.sender][ticker].depositTime;
        uint currentTime = block.timestamp;
        uint interestTime = currentTime.sub(depositTime);
        return((tokenMapping[ticker].tokenInterest.mul(interestTime)).mul(amount));
    }

    // Returns all deposits of calling account.
    function getDeposits() view external returns(string[] memory) {
        string[] memory returnData = new string[](tokenList.length);
        
        for(uint i = 0; i < tokenList.length; i++) {
            bytes32 token = tokenList[i];
            uint value = deposits[msg.sender][token].depositValue;
            uint time = deposits[msg.sender][token].depositTime;
            returnData[i] = (string(abi.encodePacked(
                            bytes32ToStr(token), " # ",
                            "Balance: ", uintToString(value), 
                            " Deposited: ", uintToString(time) 
                             )));
        }
        return returnData;
    }

    // Helper functions

    function uintToString(uint v) public pure returns (string memory) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i); // i + 1 is inefficient
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1]; // to avoid the off-by-one error
        }
        string memory str = string(s);  // memory isn't implicitly convertible to storage
        return str;
    }

    function bytes32ToStr(bytes32 _bytes32) public pure returns (string memory) {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}