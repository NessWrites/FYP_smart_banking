"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/ui/RightSidebar'
import React from 'react'
import Image from "next/image"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Withdraw = () => {
	const [amount, setAmount] = useState("");
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	const value = e.target.value;
	// Allow only numbers and optional decimal points
	if (/^\d*\.?\d*$/.test(value)&& Number(value) <= 50000) {
	  setAmount(value);
	}
	};
	  const handleEnter = () => {
		alert(`Withdrawing NPR ${amount}`);
	  };

  return (
    <div className="withdraw">
      <div className="div">
        <div className="overlap">
          <p className="smart-banking-branch">
            <span className="text-wrapper">
              Smart Banking
              <br />
            </span>

            <span className="span">Branch Location</span>
          </p>

          <div className="overlap-group">
            <div className="text-wrapper-2">ATM Simulation</div>

            <p className="please-enter-the">
              Please enter the amount you want
              <br /> to withdraw
            </p>
			

            <Image className="image" alt="Image" src="/icons/keypad.svg" width={100} height={100} />
          </div>

          <div className="overlap-group-2">
			
		  <label className="NPR">
              NPR &nbsp;
              <input 
                type="text"
                className="amount-input"
                value={amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>
			
          </div>
		  
		  <div>
				<button className="enter-button" onClick={handleEnter}>Enter</button>
			</div>
			
          <p className="please-do-not-share">
            <span className="text-wrapper-3">
              Please do not share your banking credentials to
              <br />
              untrusted parties.
              <br />
              <br />
			  
              <br />
            </span>

            <span className="text-wrapper-4">Help us make banking secure!</span>
			<p >
				Maximum Withdraw limit: 50000
			</p>
          </p>
		  
        </div>

        <div className="overlap-2">
          <div className="div-wrapper">
            <div className="text-wrapper-5">Exit</div>
          </div>

          <div className="overlap-3">
            <div className="text-wrapper-6">Main Menu</div>
          </div>

          <div className="image-wrapper">
            <Image className="img" alt="Image" src="/icons/image3.svg" width={50} height={50} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw; // <-- This ensures it's properly exported as a page
