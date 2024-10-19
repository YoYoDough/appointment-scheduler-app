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
        <div>
          <h1>Your Profile</h1>
          <img src = {session.user.image}></img>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
        </div>
      );
    };
export default page