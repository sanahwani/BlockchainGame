import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'

//constant tht refrnces all images

  const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]


class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({cardArray: CARD_ARRAY.sort(()=>0.5 - Math.random()) }) // wl gve it a random ordr each time cards r loaded on page
  }

//connecting web app to web3. this code is gvn by mm
  async loadWeb3(){
    if(window.ethereum){
      window.web3= new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3= new Web3(window.web3.currentProvider)

    }else{
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask.')
    }
  }

  async loadBlockchainData(){
    const web3= window.web3
    const accounts= await web3.eth.getAccounts()
    console.log("account", accounts[0])
    this.setState({account: accounts[0] })


  //load sc
  
  const networkId= await web3.eth.net.getId() // wl  get id of n/w . ganache here i.e 5777
  console.log(networkId) //5777
  const networkData= MemoryToken.networks[networkId]
//fetch address if its dployed to n/w
   if (networkId){
    const abi= MemoryToken.abi
    const address= networkData.address // gttng address of deployed sc on bc
    //to create js version of sc we need abi and address of sc
     const token= new web3.eth.Contract(abi,address)

     this.setState({token})

     //loadimg total supply
     const totalSupply= await token.methods.totalSupply().call()
     this.setState({totalSupply})

     //loading tokens
     // looping through all tokens to fetch out each individual token that a persn holds
      let balanceOf= await token.methods.balanceOf(accounts[0]).call()
      for( let i=0; i< balanceOf; i++){ //looping thrgh all of the persons tokens(balance)
        let id= await token.methods.tokenOfOwnerByIndex(accounts[0],i).call() //fetching all token ids that blngs to this owner
        let tokenURI= await token.methods.tokenURI(id).call()
        this.setState({
          tokenURIs:[...this.state.tokenURIs, tokenURI]
        })
      }

   }else{
    alert('smart contract not deployed to detected network.')
   }
 }

 chooseImage=(cardId)=>{
  cardId= cardId.toString()
  if(this.state.cardsWon.includes(cardId)){ //if cards won includes this card id, show white blank square
    return window.location.origin + '/images/white.png'
  } //if not, shw card image
  if(this.state.cardsChosenId.includes(cardId)){ //if cardId is in cards chosen already, then show card on the page
    return CARD_ARRAY[cardId].img
  }else{
    return window.location.origin + '/images/blank.png' // wl return default blank cards
 }
}

 flipCard= async(cardId) =>{
  let alreadyChosen= this.state.cardsChosen.length

//this wl update the chosen card to include the particular card that we passed in
  this.setState({
    cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
    cardsChosenId: [...this.state.cardsChosenId, cardId]
  })
  // if chosen cards alrdy has 1 in it and we r callng this fn fr scnd time, thn look fr a match
  if(alreadyChosen===1){
    setTimeout(this.checkForMatch, 100)
  }
 }

 checkForMatch= async()=>{
  //keeping track of chosen options
  const optionOneId= this.state.cardsChosenId[0]
  const optionTwoId= this.state.cardsChosenId[1]

  if(optionOneId== optionTwoId){
    alert('you have clicked on the same image')
  }else if(this.state.cardsChosen[0] === this.state.cardsChosen[1]){ //if card id is same
    alert('Hurray ! You have found a match....')
    
    //when match id found, mint a token of same match. mint fn takes account cnnctd to bc and token uri
    this.state.token.methods.mint(
      this.state.account,
      window.location.origin + CARD_ARRAY[optionOneId].img.toString() //windowlocationorigin-> localhost:3000/
      )
    .send({ from: this.state.account}) //initiating txn
    .on('transaction hash',(hash)=>{ //and then we wait fr txn to cme bck frm bc
      this.setState({ //then update the state with cards won
        cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
        tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img] //uris of tokens actual;y cllctd whch wl allow us to reload the page & play multiple times n save tokens forever on bc
      })
    })
  }else{
    alert('Sorry try again ! ')
  }
  //reset aftrvwe chck fr match
  this.setState({
    cardsChosen:[],
    cardsChosenId:[]
  })
  if(this.state.cardsWon.length === CARD_ARRAY.length){
    alert('Congratulations, you found them all ! ')
  }
 }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray:[],
      cardsChosen:[],
      cardsChosenId:[],
      cardsWon:[]
    }
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Memory Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4">Start Matching now....</h1>

                 { /*usimg map fn  we can iterate over each array */}

                <div className="grid mb-4" >
                   {this.state.cardArray.map((card,key)=>{
                    return(
                      <img
                        key={key} //key is smthhng tht react needs to knw whenvr we implmnt multiple elmnts with same html elmnt on pge
                        src={this.chooseImage(key)}
                        data-id={key} // gvng ech elmnt id of key
                        onClick= {(event)=>{
                          let cardId= event.target.getAttribute('data-id')
                          //dont flip if u have won the card already
                          if(!this.state.cardsWon.includes(cardId.toString())){
                            this.flipCard(cardId)
                             // flip the card if u have won the card 
                          }
                        }}
                      />
                     )   
                   })}
                </div>

                <div>

                <h5> Tokens Collected :<span id= "result">&nbsp;{this.state.tokenURIs.length} </span> </h5>
                             
                  <div className="grid mb-4" >
                {/* show minted tokens. wl loop through this  */}
                  {this.state.tokenURIs.map((tokenURI, key)=>{
                    return(
                      <img
                        key={key}
                        src={tokenURI}
                      />  
                      )
                  })}

                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
