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
        time: ""
    })

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

    

    console.log(submitted)

    useEffect(() => {
    if (submitted) {
      // Function to send formData to backend
      const sendFormData = async () => {
        try {
          const res = await fetch("http://localhost:8080/api/reminders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          // Reset form data after successful submission
            setFormData({
                reminderName: "",
                date: new Date(),
                time: "",
            });
        } catch (error) {
          console.error("Error submitting form data", error);
        } finally {
          // Reset submission state
          setSubmitted(false);
          handleClose()
        }
      };
      sendFormData();
    }
  }, [submitted, formData]);

      const onFormSubmit = (e) => {
        e.preventDefault();
        // Send formData to parent component to handle backend submission
        setSubmitted(true);
    
        // Reset the form and close the modal
        setFormData({
          reminderName: "",
          date: new Date(),
          time: "",
        });
        
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
                    <Calendar onChange={handleDateChange} value={selectedDate} />
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