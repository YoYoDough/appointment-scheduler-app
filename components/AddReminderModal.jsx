import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles for the calendar

const AddReminderModal = ({ isOpen, handleClose }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open
    
    const { data: session } = useSession();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [submitted, setSubmitted] = useState(false); // Track submission state
    const [response, setResponse] = useState(null); // Store the response from backend

    const [formData, setFormData] = useState({
        reminderName: "",
        date: new Date(),
        time: "",
        userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
    const email = session?.user.email;

    if (formData.userEmail === "")
    {
      alert("Please sign in to make appointments and use this app.");
      return;
    }

    console.log(formData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    // Handle date selection
    const handleDateChange = (date) => {
        setFormData({
          ...formData,
          date,
        });
    };

    function convertTo12HourTime(time) {
      if (time === ""){
        return;
      }
      // Split time into hours and minutes
      const [hours, minutes] = time.split(':');
    
      // Convert string to number for comparison
      let hour = parseInt(hours);
    
      // Determine AM or PM
      const period = hour >= 12 ? 'PM' : 'AM';
    
      // Convert to 12-hour format
      hour = hour % 12 || 12; // If hour is 0 or 12, convert to 12 (midnight or noon)
    
      // Return formatted time
      return `${hour}:${minutes} ${period}`;
    }

    console.log(submitted)

    useEffect(() => {
    if (submitted) {
      // Function to send formData to backend
      const sendFormData = async () => {
        try {
          const formattedDate = formData.date instanceof Date
          ? formData.date.toISOString().split('T')[0]
          : formData.date;
          const formattedTime = convertTo12HourTime(formData.time)
          const res = await fetch(`http://localhost:8080/api/reminders?userEmail=${email}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reminderName: formData.reminderName,
              reminderDate: formattedDate,  // Use correct backend naming
              reminderTime: formattedTime,   // Use correct backend naming
              userTimeZone: formData.userTimeZone
            }
            ),
          });

          // Reset form data after successful submission
            
        } catch (error) {
          console.error("Error submitting form data", error);
        } finally {
          // Reset submission state
          setFormData({
            reminderName: "",
            date: new Date(),
            time: "",
            userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
          setSubmitted(false);
          handleClose()
        }
      };
      sendFormData();
    }
  }, [submitted, formData, session]);

      const onFormSubmit = (e) => {
        e.preventDefault();
        // Send formData to parent component to handle backend submission
        setSubmitted(true);
    
    };
  
    return (
      <>
        {/* Modal Overlay to black out the background */}
        <div className="modalOverlay fixed inset-0 bg-black opacity-50 z-10" onClick={handleClose}></div>
  
        {/* Modal Content */}
        <div className="modalContainer fixed inset-0 flex items-center justify-center z-20">
          <div className="modal bg-white p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Add a New Reminder</h2>
            <form onSubmit= {onFormSubmit}>
                <input
                    type="text"
                    name = "reminderName"
                    id = "reminderName"
                    className="border p-2 w-full mb-4"
                    onChange={handleInputChange}
                    placeholder="Enter your reminder"
                    required
                />

                {/* Calendar component */}
                <div className="calendarContainer mb-10">
                    <Calendar onChange={handleDateChange} value={selectedDate} minDate={new Date()}/>
                </div>

                <div className="selectedDateDisplay mb-10">
                    <p>Selected Date: {formData.date.toDateString()}</p>
                </div>

                <input
                    type="time"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleInputChange}
                />

                <div className="flex justify-end">
                    <button
                        type = "submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </form>
          </div>
        </div>
      </>
    );
  };
  
  export default AddReminderModal;