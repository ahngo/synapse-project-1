import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import logo from './public/home/logo.png';
import text from './public/home/text.png';
import { SYNAPSE_ABI, SYNAPSE_ADDRESS } from './config'
import { PROFILE_ABI, PROFILE_ADDRESS } from './config'
import Thought from './createThought'


function isInstalled() {
   if (typeof Web3 !== 'undefined'){
      console.log('MetaMask is installed')
   }
   else{
      console.log('MetaMask is not installed')
   }
}

function isLocked(web3) {
   web3.eth.getAccounts(function(err, accounts){
      if (err != null) {
         console.log(err)
      }
      else if (accounts.length === 0) {
         console.log('MetaMask is locked')
      }
      else {
         console.log('MetaMask is unlocked')
      }
   });
}


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
    
  componentDidMount(){
    document.title = "Synapse App"
  }
  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


  async loadBlockchainData() {

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

    //const web3 = new Web3(window.web3.currentProvider);

    isInstalled();
    isLocked(web3);

    //await ethereum.enable();

    const synapse = new web3.eth.Contract(SYNAPSE_ABI, SYNAPSE_ADDRESS)
    const profile = new web3.eth.Contract(PROFILE_ABI, PROFILE_ADDRESS)

    const accounts = await web3.eth.getAccounts()
    const balanceWei = await web3.eth.getBalance(accounts[0])

    this.setState({ profile })
    this.setState({ thoughtCount })

    var balance = balanceWei/1000000000000000000

    const myString = await synapse.methods.myString().call()

    var thoughtCount = await profile.methods.thoughtCount().call()

    const latestCall = await profile.methods.thoughts(thoughtCount-1).call()
    const latest = latestCall.thought


    if (thoughtCount < 10) {
      for (var i = thoughtCount; i >= 0; i--) {
        const singleThought = await profile.methods.thoughts(i).call()
        this.setState({
          thoughts: [...this.state.thoughts, singleThought]
        })
      }
    }
    else {
      for (var i = thoughtCount; i >= (thoughtCount-10); i--) {
        const singleThought = await profile.methods.thoughts(i).call()
        this.setState({
          thoughts: [...this.state.thoughts, singleThought]
        })
      }
    }


    this.setState({ account: accounts[0], balance: balance, latest: latest })
    this.setState({ loading: false })

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      balance: '',
      myString: '',
      thoughts: [],
      loading: true

    }
    this.createThought = this.createThought.bind(this)
  }


  createThought(string) {

    this.setState({ loading: true })
    this.state.profile.methods.createThought(string).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }






  render() {
    return (
      <div className="App">
        <header className="App-header">

        <table id="t01">
          <tr>
            <th><p>Account: </p></th>
            <th><p>{this.state.account}</p></th>
          </tr>
          <tr>
            <th><p>Balance: </p></th>
            <th><p>{this.state.balance}</p></th>
          </tr>
        </table>

          <p>
            Welcome to
          </p>
          <img src={logo} className="App-logo" alt="logo" />
          <img src={text} className="Text-logo" alt="logo" />
          <p>
            a blockchain-based social network
          </p>
          <a
            className="App-link"
            href="https://github.com/csdavido/synapse-project"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>


          <br />

          <p> Send a thought to the blockchain!</p>
          <main role="main" className="">
              { this.state.loading
                ? <div id="loader" className=""><p className="">Loading...</p></div>
                : <Thought
                  thoughts={this.state.thoughts}
                  createThought={this.createThought}
                 />
              }
            </main>

            <p></p>
{/*
          <ul>
              { this.state.thoughts.map((thought, key) => {
                return(
                  <div key={key}>
                    <label>
                      <span>{thought.thought}</span>
                      <span> &nbsp; &nbsp; </span>
                      <span>{thought.user}</span>
                    </label>
                  </div>
                )
              })}
            </ul>
*/}
        </header>
      </div>


    );
  }
}

export default App;
