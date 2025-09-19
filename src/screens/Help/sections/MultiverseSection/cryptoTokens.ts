export interface CryptoToken {
  name: string;
  price: string;
  change: string;
  changeColor: string;
  icon: string;
  link: string;
}

export interface CryptoTokensData {
  row1: CryptoToken[];
  row2: CryptoToken[];
  row3: CryptoToken[];
}

// Define constants for change colors
const NEGATIVE = "#fe5572";
const POSITIVE = "#119b56";

export const cryptoTokens: CryptoTokensData = {
  row1: [
    { name: "Binance", price: "$669.27", change: "-1.73%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-1.svg", link: "https://dummy.com" },
    { name: "Polygon", price: "$0.2415", change: "-3.8%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-2.svg", link: "https://dummy.com" },
    { name: "Ethereum", price: "$2,564.22", change: "-3.6%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-3.svg", link: "https://dummy.com" },
    { name: "AVALANCHE", price: "$24.43", change: "-3.2%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-4.svg", link: "https://dummy.com" },
    { name: "Bitkub", price: "$1.71", change: "+1.14%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-5.svg", link: "https://dummy.com" },
    { name: "OKExChain", price: "$5.78", change: "-2.09%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-6.svg", link: "https://dummy.com" },
    { name: "TRON", price: "$0.2677", change: "-3.22%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-7.svg", link: "https://dummy.com" },
    { name: "THETA", price: "$0.9127", change: "-5.85%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-8.svg", link: "https://dummy.com" },
    { name: "HECO", price: "$0.9127", change: "-5.85%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-9.svg", link: "https://dummy.com" },
    { name: "BCH", price: "$420.40", change: "+0.19%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-10.svg", link: "https://dummy.com" },
  ],
  row2: [
    { name: "SHIB", price: "$0.00001455", change: "-0.16%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-11.svg", link: "https://dummy.com" },
    { name: "CAKE", price: "$2.88", change: "+17.60%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-12.svg", link: "https://dummy.com" },
    { name: "FIL", price: "$2.88", change: "+1.34%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-13.svg", link: "https://dummy.com" },
    { name: "ADA", price: "$0.7677", change: "-0.48%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-14.svg", link: "https://dummy.com" },
    { name: "SOL", price: "$175.28", change: "-1.38%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-15.svg", link: "https://dummy.com" },
    { name: "LUCA", price: "$0.6765", change: "-7.54%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-16.svg", link: "https://dummy.com" },
    { name: "VET", price: "$0.02824", change: "+0.43%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-17.svg", link: "https://dummy.com" },
    { name: "ATOM", price: "$4.87", change: "-0.72%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-18.svg", link: "https://dummy.com" },
    { name: "UNI", price: "$6.67", change: "+1.89%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-19.svg", link: "https://dummy.com" },
    { name: "ETC", price: "$18.70", change: "+0.50%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-20.svg", link: "https://dummy.com" },
    { name: "XRP", price: "$2.31", change: "-1.08%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-21.svg", link: "https://dummy.com" },
  ],
  row3: [
    { name: "DOT", price: "$4.55", change: "-0.69%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-22.svg", link: "https://dummy.com" },
    { name: "WETH", price: "$2,627.10", change: "+2.18%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-23.svg", link: "https://dummy.com" },
    { name: "DODGE", price: "$0.2280", change: "+0.30%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-24.svg", link: "https://dummy.com" },
    { name: "XLM", price: "$0.2884", change: "-0.08%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-25.svg", link: "https://dummy.com" },
    { name: "DAI", price: "$0.9997", change: "-0.00%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-26.svg", link: "https://dummy.com" },
    { name: "SCRT", price: "$0.2069", change: "+0.66%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-27.svg", link: "https://dummy.com" },
    { name: "LINK", price: "$15.86", change: "+0.23%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-28.svg", link: "https://dummy.com" },
    { name: "APE", price: "$0.6916", change: "+3.06%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-29.svg", link: "https://dummy.com" },
    { name: "LTC", price: "$95.72", change: "-0.95%", changeColor: NEGATIVE, icon: "/cryptotokens/crypto-token-30.svg", link: "https://dummy.com" },
    { name: "WBTC", price: "$109,583.74", change: "+0.11%", changeColor: POSITIVE, icon: "/cryptotokens/crypto-token-31.svg", link: "https://dummy.com" },
  ],
};
