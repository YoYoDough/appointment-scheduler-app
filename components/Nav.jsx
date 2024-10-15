"use client"
import {useState, useEffect} from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut, getProviders } from "next-auth/react"

const Nav = () => {
    const { data: session } = useSession();
    const [isPressedProfile, setIsPressedProfile] = useState(false);
    const [isPressedMenu, setIsPressedMenu] = useState(false);
    const [providers, setProviders] = useState(null)

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

    function handlePressedMenu(){
        setIsPressedMenu(prevState => !prevState);
    }
 return (
        <nav className="navbar">
          {/* Hamburger Menu Button */}
          <button className="dropdownMenuButton" onClick={handlePressedMenu}>
            <img src="/hamburgerMenu.png" alt="Menu" />
          </button>
    
          {/* Profile Image or Placeholder */}
          {session?.user ? (
            <Link href="/profile">
                <Image
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
                onClick={handlePressedProfile}
                />
            </Link>
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
            <div className="dropdownMenuSignedIn">
              <ul>
                {session?.user ? (
                  <>
                    <Link href="/profile">
                      <li>Your Profile</li>
                    </Link>
                    <li>
                      <button onClick={signOut}>Log out</button>
                    </li>
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
        </nav>
      );
 };

export default Nav