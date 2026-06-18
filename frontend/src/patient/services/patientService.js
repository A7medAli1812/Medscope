const APPOINTMENTS_KEY = "medscope_appointments";

const initialAppointments = [
    {
        id: 1,
        date: 'Jan 28, 2026',
        time: '10:00 AM',
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        hospital: 'City General Hospital',
        status: 'Confirmed'
    },
    {
        id: 2,
        date: 'Jan 28, 2026',
        time: '10:00 AM',
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        hospital: 'City General Hospital',
        status: 'Confirmed'
    },
    {
        id: 3,
        date: 'Feb 02, 2026',
        time: '2:30 PM',
        doctorName: 'Dr. Michael Chen',
        specialty: 'General Physician',
        hospital: 'City General Hospital',
        status: 'Confirmed'
    },
    {
        id: 4,
        date: 'Jan 28, 2026',
        time: '10:00 AM',
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        hospital: 'City General Hospital',
        status: 'Confirmed'
    },
    {
        id: 5,
        date: 'Feb 10, 2026',
        time: '11:00 AM',
        doctorName: 'Dr. Emily Rodriguez',
        specialty: 'Dermatologist',
        hospital: 'City General Hospital',
        status: 'Pending'
    },
    {
        id: 6,
        date: 'Jan 28, 2026',
        time: '10:00 AM',
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        hospital: 'City General Hospital',
        status: 'Confirmed'
    }
];

export const getAppointments = () => {
    const saved = localStorage.getItem(APPOINTMENTS_KEY);
    if (!saved) {
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(initialAppointments));
        return initialAppointments;
    }
    return JSON.parse(saved);
};

export const saveAppointment = (appointment) => {
    const appointments = getAppointments();
    const newAppointment = {
        ...appointment,
        id: Date.now(),
        status: 'Confirmed'
    };
    const updatedAppointments = [newAppointment, ...appointments];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
    return newAppointment;
};
