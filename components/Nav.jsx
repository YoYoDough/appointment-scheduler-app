"use client"
import {useState, useEffect, useRef} from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut, getProviders } from "next-auth/react"

const Nav = () => {
    const { data: session } = useSession();
    const [isPressedProfile, setIsPressedProfile] = useState(false);
    const [isPressedMenu, setIsPressedMenu] = useState(false);
    const [providers, setProviders] = useState(null)
    const profileRef = useRef(null); // Ref for profile dropdown
    const menuRef = useRef(null);

    // Fetch the authentication providers (e.g., Google, GitHub, etc.)
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

    function handlePressedProfile(){
        setIsPressedProfile(prevState => !prevState);
    } 

    function handlePressedMenu(e){
        setIsPressedMenu(prevState => !prevState);
    }

    // This function checks if a click is outside the dropdown
    const handleClickOutside = (event) => {
      if (profileRef.current &&!profileRef.current.contains(event.target))
      {
        setIsPressedProfile(false); // Close the profile dropdown if clicked outside
      }
  
      if (menuRef.current && !menuRef.current.contains(event.target)) 
      {
        setIsPressedMenu(false); // Close the menu dropdown if clicked outside
      }
    };

    useEffect(() => {
      // Add event listener to detect outside clicks
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Clean up the event listener when the component unmounts
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    console.log(session);
    console.log(isPressedProfile)
 return (
        <nav className="navbar">
          {/* Hamburger Menu Button */}
          <button className="dropdownMenuButton" onClick={handlePressedMenu} ref = {menuRef}>
            <img src="/hamburgerMenu.png" alt="Menu" />
          </button>
    
          {/* Profile Image or Placeholder */}
          {session?.user ? (
            <button className = "profile">
                <img
                src={session?.user.image}
                width={37}
                height={37}
                className="profileImg"
                alt="profile"
                onClick={handlePressedProfile}
                ref = {profileRef}
                />
            </button>
          ) : (
            <>
              {providers &&
              Object.values(providers).map((provider) => (
                      <button
                      type = "button"
                      key = {provider.name}
                      onClick = {() => signIn(provider.id)}
                      >
                          Sign In
                      </button>
                  ))}
            </>
          )}
        
          
    
          {/* Dropdown Menu */}
          {isPressedProfile && (
            <div className="dropdownMenuSignedIn" ref = {profileRef}>
              <ul>
                {session?.user ? (
                  <>
                    <Link href="/profile" className = "yourProfile">
                      <li>Your Profile</li>
                    </Link>
                    <Link href = "/">
                      <button onClick={signOut}>Log out</button>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* If no user is signed in, show available providers */}
                    {providers &&
                      Object.values(providers).map((provider) => (
                        <li key={provider.name}>
                          <button onClick={() => signIn(provider.id)}>
                            Sign in with {provider.name}
                          </button>
                        </li>
                      ))}
                  </>
                )}
              </ul>
            </div>
          )}

          {isPressedMenu && (
            <div className = "dropdownMenu" ref = {menuRef}>
              <ul>
                {session?.user ? (
                  <>
                    <Link href = "/">
                      <li>Home</li>
                    </Link>
                    <Link href = "/reminders">
                      <li>Your reminders</li>
                    </Link>
                    <Link href = "/editReminders">
                      <li>Edit your reminders</li>
                    </Link>
                  </>
                ) : 
                (
                  <>
                    {/* If no user is signed in, show available providers */}
                    {providers &&
                        Object.values(providers).map((provider) => (
                          <li key={provider.name}>
                            <button onClick={() => signIn(provider.id)}>
                              Sign in with {provider.name}
                            </button>
                          </li>
                        ))}
                  </>
                )}
              </ul>
            </div>
          )}
        </nav>
      );
 };

export default Nav