import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

const Crypto = createContext();

const CryptoContext = ({children}) => {
  const [curr,setCurr ] = useState("INR");
  const [symbol,setSymbol] = useState("₹");

  useEffect(()=>{
    if(curr==="INR")
    setSymbol("₹");
    else if(curr === "USD")
    setSymbol("$");
  },[curr]);

  return (
    <Crypto.Provider value={{curr,symbol,setCurr}}>
        {children}
    </Crypto.Provider>
  )
}

const CryptoState = () => {
    return useContext(Crypto);
}

export default CryptoContext;
export {CryptoState};