"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import RightSidebar from '@/components/ui/RightSidebar'
import React from 'react'
import Image from "next/image"
import { signIn } from '@/lib/actions/user.actions'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
//import { fetchUserDetails } from '@/lib/actions/user.actions'


const Home = () => {	

const [userData, setUserData] = useState<{ username: string; firstName: string; lastName: string } | null>(null);
const [balance, setBalance] = useState<number | null>(null);
const [transactions, setTransactions] = useState<any[]>([]);
const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No token found. Redirecting to login.");
        router.push("/login"); // Redirect if no token
        return;
	}

	try {
        const response = await fetch("http://localhost:8000/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

		if (!response.ok) {
			throw new Error("Failed to fetch user data");
		  }
  
		  const data = await response.json();
		  console.log("User Data:", data);
		  setUserData(data);
		  // Fetch account balance
		  const balanceResponse = await fetch("http://localhost:8000/api/balance", {
			method: "GET",
			headers: {
			  Authorization: `Bearer ${token}`,
			  "Content-Type": "application/json",
			},
		  });
  
		  if (!balanceResponse.ok) throw new Error("Failed to fetch balance");
		  const balanceData = await balanceResponse.json();
		  setBalance(balanceData.balance);

  
		  // Fetch transaction history
		  const transactionResponse = await fetch("http://localhost:8000/api/account-statement", {
			method: "GET",
			headers: {
			  Authorization: `Bearer ${token}`,
			  "Content-Type": "application/json",
			},
		  });
  
		  if (!transactionResponse.ok) throw new Error("Failed to fetch transactions");
		  const transactionsData = await transactionResponse.json();
		  setTransactions(transactionsData);
		} catch (error) {
		  console.error("Error fetching user data:", error);
		  router.push("/"); // Redirect if token is invalid
		}
	  };

	  
	  fetchUserData();
  }, [router]);

    
  return (
	<section className='home'>
<div className='home-content'>

<header className='home-header'>
	<HeaderBox
	type = "greeting"
	title = "Welcome"
	user ={userData ? `${userData.firstName} ${userData.lastName}` : "Guest"}
	subtext = "Access and manage your account and transactions efficiently."
	
	/>

	<TotalBalanceBox
	accounts ={[]}
	totalBanks ={1}
	totalCurrentBalance ={balance}
	/>
</header>
RECENT TRANSACTIONS
</div>

<RightSidebar
user = {userData ? userData.firstName : "Guest"} transactions={[]}

banks = {[{currentBalance:1234.50}, {currentBalance:2234.50}]}
/>
	</section>
  )
}

export default Home