const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => {
  let token

  before( async()=>{
  	token=await MemoryToken.deployed()
  })

  describe('deployment',async()=>{
  	it('deploys successfully', async()=>{
  		const address=token.address
  		//making sure token exists but we dnt know wht its value wl b
  		assert.notEqual(address, '0x0')
  		assert.notEqual(address, '')
  		assert.notEqual(address, null)
  		assert.notEqual(address, undefined)
  	})

  	it('has a name', async()=>{
  		const name= await token.name()
  		assert.equal(name, 'Memory Token')

  	})
  	it('has a symbol', async()=>{
  		const symbol= await token.symbol()
  		assert.equal(symbol, 'MEMORY')

  	})	
  })

  describe('token distribution', async()=>{
  	let result

  	it('mints tokens', async()=>{
  		await token.mint(accounts[0],'https://www.token-uri.com/nft') // acc[0]-> address of acc who gets minted tokens. , tokenuri is arbitrly set

  		//it should increase total supply
  		result= await token.totalSupply()
  		assert.equal(result.toString(), '1', 'total supply is correct')

  		//it increments owner balance
  		result= await token.balanceOf(accounts[0])
      assert.equal(result.toString(), '1', 'balanceOf is correct')

      //token should belong to owner
      result=await token.ownerOf('1') //owner of id 1
  		assert.equal(result.toString(),  accounts[0].toString(), 'ownerOf is correct') //token of id 1 should belong to the frst account we minted it for
  		result= await token.tokenOfOwnerByIndex(accounts[0],0)

  		//owner can see all tokens
      //looping through all tokens to fetch out each individual token that a persn holds
      let balanceOf= await token.balanceOf(accounts[0])
      let tokenIds=[]
      for( let i=0; i< balanceOf; i++){ //looping thrgh all of the persons tokens(balance)
        let id= await token.tokenOfOwnerByIndex(accounts[0],i) //fetching all token ids that blngs to this owner
        tokenIds.push(id.toString()) //pushing all token ids in this array
      }
      let expected= ['1'] //here person has 1 token(balance)
      assert.equal(tokenIds.toString(), expected.toString(), 'token Ids are correct')

      //token uri correct
      let tokenURI= await token.tokenURI('1')
      assert.equal(tokenURI, 'https://www.token-uri.com/nft')
    	})
  })
})
