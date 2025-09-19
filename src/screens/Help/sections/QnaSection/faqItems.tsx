// faqData.ts

import { Link } from "react-router-dom";

export interface QAItem {
  question: string;
  answer: string | JSX.Element;
}

export interface Tab {
  id: string;
  name: string;
  qa: QAItem[];
}

export const faqTabs: Tab[] = [
  {
    id: "atm",
    name: "ATM",
    qa: [
      {
        question: "What is ATM?",
        answer: "ATM is a set of decentralised mechanisms based on multiple blockchains, from which the relative consensus network can emerge."
      },
      {
        question: "Who can use ATM?",
        answer: "Anyone that is using a MetaMask wallet and has joined the BSC network."
      },
      {
        question: "Where to find and download the ATM mobile app?",
        answer: "To download the ATM mobile app, simply go to your device's app store (iOS or Google Play Store). In the search bar, type in \"ATM connect\" to locate the app. Once you find it, follow the on-screen instructions to download and install it on your device."
      },
      {
        question: "How to connect with MetaMask wallet??",
        answer: "To connect to your MetaMask wallet, search for \"MetaMask\" on Google Chrome and download it from the official website by clicking the [Download] button. Add MetaMask to Chrome, then click 'Web app' to sign in to ATM with ease using your MetaMask wallet. Happy connecting!"
      },
      {
        question: "How do I connect to ATM?",
        answer: "To connect to ATM, ensure your wallet is linked to the Binance Smart Chain. Install MetaMask, process to sign in to ATM with MetaMask, and add the 'BSC network' chain. Enhance your experience by adding LUCA, USDC & AGT to your wallet. You can access wallet at anytime by connecting to ‘Web app’. For more convenience, download the ATM.Connect app."
      },
      {
        question: "Is ATM open source?",
        answer: (
          <>
            Yes. You can find out more{" "}
            <a 
              href="https://github.com/ATM-Developer/atm-contract"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-[#1f7a7a]"
            >
              here
            </a>.
          </>
        )
      },
      {
        question: "What is ATM composed of?",
        answer: "The main components of ATM are the consensus contract, ATM Rank algorithm, LUCA issuance algorithm and community voting mechanisms."

      },
      {
        question: "How do I create a Consensus Connection?",
        answer: (
          <>
            Go to the “Consensus Connection” page and click the “Create Consensus” button. Fill in the requested information and then submit! For more details, follow the “Create a Consensus Connection” guide located{" "}
            <a 
              href="https://www.atmrank.com/pdf/atm-en/4.pdf"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-[#1f7a7a]"
            >
              here
            </a>.
          </>
        )
      },
      {
        question: "How do I cancel a connection?",
        answer: (
          <>
            Go to the “Consensus Connection - Connected” page and navigate to “View Details” and then “Agree to Disconnect”. For more details look for step 6 in our guide located{" "}
            <a 
              href="https://www.atmrank.com/pdf/atm-en/4.pdf"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-[#1f7a7a]"
            >
              here
            </a>.
          </>
        )
      },
      {
        question: "How many connections can I create?",
        answer: "It’s unlimited! There’s no upper limit of the number of connections that you can establish."
      },
      {
        question: "Which public blockchains does ATM currently support?",
        answer: "At this moment in time only the Binance network is supported, but we will support the following in the future: Matic, OKExChain, Theta & Ethereum."
      },
      {
        question: "Are those the only blockchains that will be supported?",
        answer: "No! Support for new blockchains can be added depending on the will of the community. By voting for proposals, you can decide the next blockchain that ATM incorporates."
      },
      {
        question: "Is ATM a pyramid scheme or MLS ?",
        answer: (
          <>
            Well, sorry to disappoint the more sceptical among you but no, it's not! The ATM algorithm, cleverly named ATMRank, 
            is based on Google's PageRank. The resemblance is not just in name but also in code - you can see for yourself, 
            it's open source. Would you say that Google's PageRank is a pyramid scheme? 🙂
            <br/>
            ATM's rewards are entirely dependent on your influence as an influencer (sorry, don't have a thesaurus handy...) - 
            While the early adopters have been rewarded significantly, it does not mean that they are benefitting from your arrival to the network as would be the case in a classic pyramid scheme.
            <br/>
            The reward mechanism is a zero-sum game, meaning that that you can only grow your share of the pie but the pie itself never grows - 
            hardly a good deal for those pesky users at the top of the pyramid, right!? And don't forget, you don't even need an invite to join ATM - that's the opposite of a pyramid scheme!
          </>
        )
      },
    ]
  },
  {
    id: "luca",
    name: "LUCA",
    qa: [
      {
        question: "How can I get LUCA?",
        answer: "1.Participate in the initial LUCA event; 2. Provide liquidity and earn rewards for the LUCA/USDC transaction pair on Pancakeswap; 3. From establishing Consensus Connections; 4. From stake mining."
      },
      {
        question: "Where can I buy LUCA?",
        answer: "You can’t! After the LUCA event is over, LUCA can be converted using the Pancakeswap platform, or earned using the methods mentioned in the previous question."
      },
      {
        question: "How many Luca will be issued?",
        answer: "There will be an initial issuance of 15 million tokens, starting from ATM’s official launch date, 36000 LUCAs will be issued daily. After 1,000 days the deflationary mechanism will be enabled."
      },
      {
        question: "How to connect with MetaMask wallet?",
        answer: "To connect to your MetaMask wallet, search for \"MetaMask\" on Google Chrome and download it from the official website by clicking the [Download] button. Add MetaMask to Chrome, then click 'Web app' to sign in to ATM with ease using your MetaMask wallet. Happy connecting!"
      },
      {
        question: "What are the benefits of owning LUCA?",
        answer: "By owning LUCA you have the right to vote on proposals put forward by the community, ensuring your voice is heard!"
      },
      {
        question: "What’s that ‘Deflationary Mechanism’ you mentioned?",
        answer: "After 1000 days from the initial LUCA event, the deflationary mechanism will be initialised. This process will check the percentage that LUCA drops compared with the average price of the previous day and then automatically lower the LUCA issuance by the same percentage. Note that LUCA locked in Consensus Contracts will not be affected by the deflation!"
      },
      {
        question: "How do I become a node staker",
        answer: (
          <>
            Navigate to the “Consensus Connection-PR Node” page and select a node. Click on “Stake” and enter the amount before confirming. 
            You can follow our more in-depth guide {" "}
            <a 
              href="https://www.atmrank.com/pdf/atm-en/1.pdf"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-[#1f7a7a]"
            >
              here
            </a>
            {" "} for more details.
          </>
        )
      },
      {
        question: "Where can I view my stake income?",
        answer: "Go to the “Consensus Connection – Gross Income” page."
      },
      {
        question: "How to convert an Ethereum Mainnet token to the Binance Smart Chain?",
        answer: (
          <>
            The ability to transfer tokens cross-chain is an essential need, it allows users to transfer their funds from one blockchain network to another. 
            Multiple networks now have their respective “bridges” to help in easy fund transfers. The following is a list of all cross-chain apps supporting the binance smart chain, 
            the majority of which supply a tutorial to help you use them{" "}
            <a 
              href="https://docs.binance.org/smart-chain/guides/cross-chain.html"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-[#1f7a7a]"
            >
              https://docs.binance.org/smart-chain/guides/cross-chain.html
            </a>
          </>
        )
      },
    ]
  },
  {
    id: "community",
    name: "Community",
    qa: [
      {
        question: "How can I keep track of proposals?",
        answer: (
          <>
            You can see this on our Community Autonomy page located {" "}
            <Link
              to="/community"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-[#1f7a7a]"
            >
              here
            </Link>!
          </>
        )
      },
      {
        question: "What is the board? What does it do?",
        answer: "The Board is made up of the 47 users that have the highest PR value in the community, who jointly hold the secret key of the community fund. If a member of the board is inactive for a prolonged period, they will be replaced by the user with the next highest PR value."
      },
      {
        question: "What is the role of the Board?",
        answer: "The Board members jointly keep the wallet secret key of the Fund, and fund can only be used upon signature of more than half of the members. The Board exercises the execution and operation rights."
      },
      {
        question: "How do I stay up to date with ATM?",
        answer: (
          <>
            View our News page {" "}
            <Link
              to="/news"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-[#1f7a7a]"
            >
              here
            </Link>!
          </>
        )
      },
      {
        question: "How to contact us?",
        answer: "Users can send an email to: autonomoustrustmomentum@gmail.com."
      },
    ]
  },
  {
    id: "governance",
    name: "Governance",
    qa: [
      {
        question: "What is AGT used for?",
        answer: "The community proposal function can be implemented by the community governance token AGT. Users who hold the AGT hold voting rights."
      },
      {
        question: "What’s the difference between common proposals and special proposals?",
        answer: "(1) In terms of common proposals, community members can vote YES/NO and the proposal will be valid if the total votes exceed 2% of the total AGT circulation. If the proposal obtains more than 2/3 YES, it is approved and implementation starts. Otherwise, the proposal is failed and will not be implemented. (2) For special proposals, the proposal initiator shall publicize the entry-into-force conditions and implementation of the proposal in the community in advance. After the publicity period ends, the proposal flow continues. If there is any objection throughout the publicity period, the initiator need to change the conditions and publicize it again."
      },
      {
        question: "How to obtain AGT?",
        answer: "After users created a consensus connection with LUCA, they can receive AGT distributed by the ATM community."
      },
      {
        question: "Is AGT the only governance token for the community?",
        answer: "AGT is the only governance token of the ATM community."
      },
      {
        question: "Can I get AGT back after the proposal?",
        answer: "After each proposal voting ends, community users can redeem AGT for voting on other proposals."
      },
      {
        question: "How many AGTs do I need to exercise community governance rights?",
        answer: "At least 1 AGT."
      },
      {
        question: "How to initiate a proposal?",
        answer: "By far, the proposal can only be initiated by the ATM. If you need to initiate a proposal, please email to the ATM official (autonomoustrustmomentum@gmail.com) to make an application. The proposal initiating will be progressively opened in the later stage."
      },
    ]
  }
];
