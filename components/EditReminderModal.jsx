import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EditReminderModal = ({ handleClose, isOpen, reminder}) => {
    if (!isOpen) return null;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        reminderName: "",
        date: new Date(),
        time: "",
        userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    // Initialize form data with reminder details
    useEffect(() => {
        if (reminder) {
            setFormData({
                ...reminder,
                reminderName: reminder.reminderName || "",
                date: new Date(reminder.reminderDate) || new Date(),
                time: reminder.reminderTime || ""
            });
            setSelectedDate(new Date(reminder.reminderDate) || new Date());
        }
    }, [reminder]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setFormData({
            ...formData,
            date,
        });
    };

    const convertTo12HourTime = (time) => {
        if (time === "") return;
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${minutes} ${period}`;
    };

    useEffect(() => {
        if (submitted) {
            const saveReminder = async () => {
                const formattedDate = formData.date instanceof Date
                    ? formData.date.toISOString().split('T')[0]
                    : formData.date;
                const formattedTime = convertTo12HourTime(formData.time);

                const updatedReminder = {
                    ...reminder,
                    reminderName: formData.reminderName,
                    reminderDate: formattedDate,
                    reminderTime: formattedTime,   // Use correct backend naming
                    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };
                console.log(updatedReminder);
                const res = await fetch(`http://localhost:8080/api/reminders?id=${reminder.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedReminder)
                })
                console.log(res);
                
                handleClose(); // Close modal
            };
            saveReminder();
            setSubmitted(false);
        }
    }, [submitted]);

    const onFormSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <div className="modalOverlay fixed inset-0 bg-black opacity-50 z-10" onClick={handleClose}></div>

            <div className="modalContainer fixed inset-0 flex items-center justify-center z-20">
                <div className="modal bg-white p-6 rounded-lg shadow-lg relative">
                    <h2 className="text-xl font-bold mb-4">Edit Reminder</h2>
                    <form onSubmit={onFormSubmit}>
                        <input
                            type="text"
                            name="reminderName"
                            id="reminderName"
                            className="border p-2 w-full mb-4"
                            onChange={handleInputChange}
                            value={formData.reminderName}
                            placeholder="Edit your reminder"
                            required
                        />

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
                                type="submit"
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

export default EditReminderModal;