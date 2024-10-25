"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const page = () => {
    const [reminders, setReminders] = useState([]);
    const { data: session } = useSession();
    useEffect(() => {
        const fetchReminders = async()=>{
            const response = await fetch(`http://localhost:8080/api/reminders/id?email=${session?.user.email}`);
            const data = await response.json();
            setReminders(prevReminders => prevReminders = data);
        }
        fetchReminders()
    }, [])
  return (
    <div>
        
            {reminders.map((reminder) => (
                <ul>
                    <li>{reminder.reminderName}</li>
                    <li>{`Date: ${reminder.reminderDate}`}</li>
                    <li>{reminder.reminderTime}</li>
                </ul>
            ))}
    </div>
  )
}

export default page