"use client"
import { useState } from 'react'

import Link from 'next/link'
import AddReminderModal from '@components/AddReminderModal'

const page = () => {
    
    const [reminders, setReminders] = useState([]);
    const [addReminderModal, setAddReminderModal] = useState(false);

    function handleReminderModal(){
        setAddReminderModal(prevMode => !prevMode)
    }

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
            <h1 className="text-xl font-bold mb-4">Your Reminders</h1>
            <div className="remindersList">
                {reminders.length === 0 ? (
                    <p>No reminders added yet.</p>
                ) : (
                    <ul>
                    {reminders.map((reminder, index) => (
                        <li key={index} className="reminderItem p-2 mb-2 border-b">
                        {reminder.text}
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