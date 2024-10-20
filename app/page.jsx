import Image from "next/image";
import Link from 'next/link';

const page = () => {
  return (
    <div className = "homeContainer w-full">
      <div className = "homeOpener">
        <h1 className= "head_text">Welcome to Appointify!</h1>
        <p className = "desc">Your go-to app for making and setting up your appointments and reminders effortlessly.</p>
        <Link href = "/reminders" className ="block mt-5 text-lg underline-offset-4 hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300  dark:text-neutral-300">Get Started</Link>
      </div>
    </div>
  )
}

export default page
