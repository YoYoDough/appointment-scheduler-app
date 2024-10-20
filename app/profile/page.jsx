"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const page = () => {
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        const fetchUserDetails = async () => {
          if (session) {
            const response = await fetch(`http://localhost:8080/api/users?email=${session.user.email}`);
            if (response.ok) {
              const data = await response.json();
            } else {
              console.error('Failed to fetch user details');
            }
          }
        };
    
        fetchUserDetails();
      }, [session]);
      if (!session) {
        return <div>Please log in to view your profile.</div>;
      }
    
      return (
        <div className = "profile">
          <h1 className = "text-4xl font-bold mb-10">Your Profile</h1>
          <div className = "profileDetails">
            <img src = {session.user.image} className = "profileDetailsImg"></img>
            <p className = "text-xl">Name: {session.user.name}</p>
            <p className = "text-xl">Email: {session.user.email}</p>
          </div>
        </div>
      );
    };
export default page