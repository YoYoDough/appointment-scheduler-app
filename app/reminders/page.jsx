"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import Link from 'next/link'
import AddReminderModal from '@components/AddReminderModal'

const page = () => {
    const {data: session} = useSession();
    
    const [reminders, setReminders] = useState([]);
    const [addReminderModal, setAddReminderModal] = useState(false);

    function handleReminderModal(){
        setAddReminderModal(prevMode => !prevMode)
    }

    useEffect(() => {
      const fetchReminders = async() => {
        if (!session)
        {
          return;
        }
        const res = await fetch(`http://localhost:8080/api/reminders/id?email=${session?.user.email}`)
        const data = await res.json();
        setReminders(prevReminders => prevReminders = data);
      }
      fetchReminders()
    }, [session])
    console.log(reminders);
    console.log(new Date(Date.now() + new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0])
  return (
    <div className="remindersPage w-full p-4">
        <div className="remindersBox bg-white shadow-md rounded-lg p-6">
            
            {/* Add Reminders Section */}
            <div className="addReminders flex justify-between items-center mb-4">
              <p className="text-lg font-semibold mr-5">Add Reminders</p>
              <button onClick = {handleReminderModal} className="addRemindersButton bg-blue-500 p-3 rounded-full">
                <img src="/addButton.png" className="addRemindersImg" alt="Add Reminder"/>
              </button>
            </div>

            {/* Pass state and function as props to the modal */}
            <AddReminderModal isOpen={addReminderModal} handleClose={handleReminderModal} />
    
            {/* Your Reminders Section */}
            <span><h1 className="text-xl font-bold mb-4">Your Reminders </h1><p className = "text-s mb-5">(YYYY-MM-DD)</p></span>
            
            <div className="remindersList">
                {reminders.length === 0 ? (
                    <p>No reminders added yet.</p>
                ) : (
                  <ul>
                  {reminders.map((reminder, index) => (
                      <li key={index} className="reminderItem p-2 mb-2 border-b">
                      <li>
                          <span className="text-red-600">{reminder.reminderTimeUtc.split("T")[0] === new Date(Date.now() + new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0] ? "DUE TODAY!!! " : ""}</span>
                          <b>{reminder.reminderName}</b>
                      </li>
                      <li>
                          {reminder.reminderDate} {reminder.reminderTime ? `, ${reminder.reminderTime}` : ""}
                      </li>
                  </li>
                  ))}
                  </ul>
                )}
            </div>
        </div>
    </div>
  )
}

export default page