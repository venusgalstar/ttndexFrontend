/// <reference types="react-scripts" />

interface WindowChain {
  onto?: { isMetaMask?: true; request?: (...args: any[]) => void }
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => void
  }
}
