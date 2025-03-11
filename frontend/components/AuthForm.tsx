'use client';

import Link from 'next/link'
import React, { useState } from 'react'
import Image from "next/image"


import { number, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema, fetchData } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchUserDetails, signIn, signUp } from '@/lib/actions/user.actions';
 

const AuthForm = ({type}:{type: string}) => {
	const router = useRouter();
	const [user, setuser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const formSchema = authFormSchema(type);
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		  username: "",
		  password:''
		},
	  })
	 
	  // 2. Define a submit handler.
	  const onSubmit= async(
			data: z.infer<typeof formSchema>
		)=> {
		// Do something with the form values.
		// event.preventDefault(); // Prevents the default form submission

		setErrorMessage(null);
		setIsLoading(true);
		try{
			//Sign up with Appwrite and clean plain token
			if(type === 'sign-up'){
				const newUser = await signUp(data);
				setuser(newUser);

				

			}
			if(type ==='sign-in'){
				const response = await signIn({
					username: data.username,
					password: data.password,
					// token: data.access_token
				})
				console.log({ response })

				if(response.access){

					 // Fetch user details using the token
					 //const userDetails = await fetchUserDetails(response.access);
					 //console.log("User Details:", userDetails);
				
				//Save the token to the local storage
				localStorage.setItem('authToken', response.access);
				console.log("Token Saved: ",localStorage.getItem('authToken'));
				// Redirect to home page with user details
                router.push('/',);

				// Make an authenticated request
                //await fetchData("http://localhost:8000/api/login");
            } else {
                console.log('No token found in response.');
            }
			
			
				// if(response) router.push('/')
				console.log({ responseData: response.data, response})
			}
			//console.log(values)
			setIsLoading(false);
		} catch (error: any) {
			console.log("Sign-in error:", error.message);
			setErrorMessage(error.message);

		} finally {
			setIsLoading(false);
		}

		
	  }

  return (
	<section className = "auth-form">
		<header className = 'flex flex-co gap-5 md:gap-8'>
		<Link href ="/"  className="cursor-pointer flex items-center gap-2">

			<Image 
				src ="/icons/logo.svg"
				width ={44}
				height={44}
				alt ="Smart Bank logo"
				/>
				<h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>
				Smart Banking</h1>
		</Link>	
	
		</header>

<div className = "flex flex-col gap-1 md:gap-3">
	<h1 className = "text-24 lg:text-30 font-semibold text-gray-900">
		{user 
		? 'Link Account':type ==='sign-in'?
		'Sign In':
		'Sign Up'
		}
		<p className = "text-16 front-normal text-gray-600">

			{user
			? 'Link your Account to get Started':
			'Please enter your login details'
			}
		</p>

	</h1>
</div>

		
		{user?(
		<div className= "flex flex-col gap-4">
			{/*PlaidLink*/}

		</div>
	):(
		<>
		<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }} className="space-y-8"> */}
	  {type ==='sign-up' && (
			<>
			<div className = "flex gap-4">
				<CustomInput control = {form.control}
				name = 'firstName' label ="First Name"
				placeholder = 'Enter your first name'/>
				<CustomInput control = {form.control}
				name = 'lastName' label ="Last Name"
				placeholder = 'Enter your last name'/>
			</div>

			<CustomInput control = {form.control}
			name = 'address' label ="Address"
			placeholder = 'Enter your specific address'/>

			<CustomInput control = {form.control}
			name = 'city' label ="City"
			placeholder = 'Enter your City Area'/>
			<div className = "flex gap-4">

			<CustomInput control = {form.control}
				name = 'district' label ="District"
				placeholder = 'example: Kathmandu'/>
				<CustomInput control = {form.control}
				name = 'provinces' label ="Provinces"
				placeholder = 'example: Bagmati'/>
			</div>

			<div className = "flex gap-4">
			<CustomInput control = {form.control}
			name = 'dateOfBirth' label ="Date of Birth"
			placeholder = 'example: YYYY-MM-DD'/>
			<CustomInput control = {form.control}
			name = 'panNumber' label ="Pan Number"
			placeholder = '1234567890'/>
			</div>
			
			</>
		)}

		<CustomInput
		control = {form.control} name ='username' label = 'Username'
		placeholder = 'Enter your phone number'
		/>
		<CustomInput
		control = {form.control} name ='password' label = 'Password'
		placeholder = 'Enter your password'
		/> 



		<div className = "flex flex-col gap-4">
        <Button type="submit" disabled = {isLoading}
		className = "form-btn">
			{isLoading?(
				<>
				<Loader2 size ={20}
				className = "animate-spin"/>&Nanum_Brush_Script;
				Loading...
				</>)
				:type === 'sign-in'
				?'Sign In':'Sign Up'
			}
		</Button>
		</div>
      </form>
    </Form>
			<footer className = "flex justify-center gap-1">
				<p className = "text-14 font-normal text-gray-600">
					{type ==='sign-in'?
					"Don't have an account?"
				:"Already have an account>"}
				</p >
				<Link href = {type ==='sign-in'? '/sign-up':
					'/sign-in'
				}>
					{type ==='sign-in'? 'Sign Up':
					'Sign In'
				}

				</Link>


			</footer>

		</>
	)
	}

	</section>
  )
}

export default AuthForm