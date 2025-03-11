"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/ui/RightSidebar'
import React from 'react'
import Image from "next/image"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BranchDropdown from '@/components/ui/BranchDropdown'
const branchLocations = [
  "Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Bharatpur", "Birgunj", "Janakpur", "Butwal", "Hetauda", "Tulsipur", "Dharan", "Nepalgunj", "Kalaiya", "Itahari", "Ghorahi", "Dhangadi", "Jitpursimara", "Bhaktapur", "Bhimdoot", "Budhanilkantha"
];
const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and optional decimal points
    if (/^\d*\.?\d*$/.test(value) && Number(value) <= 50000) {
      setAmount(value);
    }
  };

  const handleEnter = () => {
    alert(`Withdrawing NPR ${amount} from ${selectedBranch}`);
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch); // Update the selected branch
  };

  return (
    <div className="withdraw">
      <div className="div">
        <div className="overlap">

          

            <div className = "smart-banking-dropdown">
            <label htmlFor="branch-select" className="span">
              Branch Location:</label>
              <select
                  id="branch-select"
                  value={selectedBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  style={{
                    padding: '8px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
    }}
  >
    {branchLocations.map((branch, index) => (
      <option key={index} value={branch}>
        {branch}
      </option>
    ))}
  </select>
          
  </div>
  <div className="smart-banking-branch">
            <span >
              Smart Banking
              <br />
            </span>
            </div>
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
            
          </p>
          <p>Maximum Withdraw limit: 50000</p>
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

export default Withdraw;