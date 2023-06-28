pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract MemoryToken is ERC721Full {
  
  constructor() ERC721Full("Memory Token", "MEMORY") public{

  }
//whenever we get 2 same matches, we wl mint tokens here so that it can be distributed.

//tokenURI-> loc. of the stored image. totalSupply->erc721 fn, it keeps track of supplied tokens. 

function mint(address _to, string memory _tokenURI) public returns (bool){
	uint _tokenId= totalSupply().add(1);
	_mint(_to, _tokenId);
	_setTokenURI(_tokenId,_tokenURI);
	return true;
	
}
}
