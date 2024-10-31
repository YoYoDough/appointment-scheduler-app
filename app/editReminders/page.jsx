"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import EditReminderModal from '@components/EditReminderModal'

const page = () => {
    const [loading, setLoading] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [remindersToDelete, setRemindersToDelete] = useState([]); // For deletion
    const [editReminderButton, setEditReminderButton] = useState(false);
    const { data: session } = useSession();
    console.log(remindersToDelete);

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
      if (!remindersToDelete.length) return; // Ensure there's something to delete
    
      try {
        const res = await fetch(`http://localhost:8080/api/reminders`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(remindersToDelete),
        });
    
        if (res.ok) {
          // Update the UI to remove deleted reminders
          setReminders((prevReminders) =>
            prevReminders.filter((reminder) => !remindersToDelete.includes(reminder.id))
          );
          setRemindersToDelete([]); // Clear selection after deletion
        }
      } catch (error) {
        console.error("Error deleting reminders", error);
      }
    };

    const handleEdit = (reminder) => {
      setEditReminderButton(prevMode => !prevMode);
      setSelectedReminder(reminder);
    }
    console.log(editReminderButton);

  return (
    <div className = "editRemindersContainer w-full">
        <h2 className = "mt-5 mb-5 text-5xl font-bold leading-[1.15] text-black sm:text-4xl">Edit Reminders</h2>
          {reminders.length === 0 && <h1 className = "m-20 text-2xl font-bold leading-[1.15] text-black sm:text-2xl">You have no reminders right now.</h1>}
            {loading === false && reminders.map((reminder) => (
                <div className = "editReminderBox m-20">
                    <input type = "checkbox" className = "checkbox" onChange={() => handleCheckboxChange(reminder.id)} checked={remindersToDelete.includes(reminder.id)}/>
                    <ul className = "remindersList">
                        <li>{reminder.reminderName}</li>
                        <li>{reminder.reminderDate} {reminder.reminderTime !== null ? `, ${reminder.reminderTime}` : ""}</li>
                        <button onClick = {() => handleEdit(reminder)} className = "justify-self-end self-end">Edit</button>
                    </ul>
                    
                </div>
            ))}
        {reminders.length !== 0 && <button onClick = {handleDelete} className = "w-20 p-3 m-3 rounded border-2 border-solid border-black rounded self-end mr-16"><img className = "deleteButtonImage" src = "/deleteButton.png"></img></button>}
        {editReminderButton && (
            <EditReminderModal
                key = {selectedReminder.id}
                isOpen={editReminderButton} // Pass the state to control visibility
                reminder={selectedReminder}
                onSave={(updatedReminder) => {
                    // Handle the updated reminder
                    // You might want to close the modal here after saving
                    setEditReminderButton(false);
                }}
                handleClose={() => setEditReminderButton(false)} // Close function
            />
        )}
    </div>
  )
}

export default page