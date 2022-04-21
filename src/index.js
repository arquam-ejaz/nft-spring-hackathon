import 'regenerator-runtime/runtime'

import { initContract, login, logout } from './utils'

// import getConfig from './config'
// const { networkId } = getConfig('testnet')
const BN = require("bn.js");

// global variable used throughout
//let currentGreeting

const submitButton = document.querySelector('form button')

window.onload = async () => {
  submitButton.disabled = true
  const minted = await window.contract.nft_token({
    token_id: window.accountId
  });

  if (minted) {
    submitButton.disabled = true
    document.querySelector('[data-behavior=notification]').style.display = 'block'

    // remove notification again after css animation completes
    // this allows it to be shown again next time the form is submitted
    setTimeout(() => {
      document.querySelector('[data-behavior=notification]').style.display = 'none'
    }, 11000)
  } else {
    submitButton.disabled = false
  }
}



document.querySelector('form').onsubmit = async (event) => {
  event.preventDefault()

  try {
    // make an update call to the smart contract
    await window.contract.nft_mint({
      token_id: window.accountId,
      metadata: {
        title: "Non Fungible Token by aejaz",
        description: "This NFT is a part of NEAR Spring Hackathon ;)",
        media: "https://link.ap1.storjshare.io/s/jxci35fn63uizbmtd7x3xhkfljma/nft-spring/NEAR%20NFT.png?wrap=0"
      },
      receiver_id: window.accountId,
    },
      300000000000000,
      new BN("100000000000000000000000"))
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  }
}

// document.querySelector('input#greeting').oninput = (event) => {
//   if (event.target.value !== currentGreeting) {
//     submitButton.disabled = false
//   } else {
//     submitButton.disabled = true
//   }
// }

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block'

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  // populate links in the notification box
  // const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)')
  // accountLink.href = accountLink.href + window.accountId
  // accountLink.innerText = '@' + window.accountId
  // const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)')
  // contractLink.href = contractLink.href + window.contract.contractId
  // contractLink.innerText = '@' + window.contract.contractId

  // update with selected networkId
  // accountLink.href = accountLink.href.replace('testnet', networkId)
  // contractLink.href = contractLink.href.replace('testnet', networkId)

  //fetchGreeting()
}

// update global currentGreeting variable; update DOM with it
// async function fetchGreeting() {
//   currentGreeting = await contract.get_greeting({ account_id: window.accountId })
//   document.querySelectorAll('[data-behavior=greeting]').forEach(el => {
//     // set divs, spans, etc
//     el.innerText = currentGreeting

//     // set input elements
//     el.value = currentGreeting
//   })
// }

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)
