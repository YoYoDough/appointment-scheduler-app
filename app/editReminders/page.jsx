"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const page = () => {
    const [loading, setLoading] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [remindersToDelete, setRemindersToDelete] = useState([]); // For deletion
    const { data: session } = useSession();

    useEffect(() => {
        const fetchReminders = async()=>{
            if (!session)
            {
                return;
            }
            setLoading(true)
            const response = await fetch(`http://localhost:8080/api/reminders/id?email=${session?.user.email}`);
            const data = await response.json();
            console.log(data);
            setReminders(prevReminders => prevReminders = data);
            setLoading(false);
        }
        fetchReminders()
    }, [session])

    // Handle checkbox selection for deletion
    const handleCheckboxChange = (id) => {
        setRemindersToDelete((prevSelected) =>
        prevSelected.includes(id)
            ? prevSelected.filter((reminderId) => reminderId !== id)
            : [...prevSelected, id]
        );
    };

    // Handle delete request
  const handleDelete = async () => {
    if (!reminderToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/reminders/${reminderToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setReminders((prevReminders) =>
          prevReminders.filter((reminder) => reminder.id !== reminderToDelete)
        );
        setReminderToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting reminder", error);
    }
  };

  return (
    <div className = "editRemindersContainer w-full">
        <h2 className = "mt-5 text-5xl font-bold leading-[1.15] text-black sm:text-4xl">Edit Reminders</h2>
            {loading === false && reminders.map((reminder) => (
                <div className = "editReminderBox">
                    <input type = "checkbox" className = "checkbox" onChange={() => handleCheckboxChange(reminder.id)} checked={remindersToDelete.includes(reminder.id)}/>
                    <ul className = "remindersList">
                        <li>{reminder.reminderName}</li>
                        <li>{reminder.reminderDate}, {reminder.reminderTime}</li>
                        <button className = "justify-self-end self-end">Edit</button>
                    </ul>
                </div>
            ))}
        {<button className = "w-20 p-3 m-3 rounded border-2 border-solid border-black rounded self-end mr-16"><img className = "deleteButtonImage" src = "/deleteButton.png"></img></button>}
    </div>
  )
}

export default page