export const mockMedicalHistory = {
    patient: {
        name: "John Smith",
        id: "PT001",
        bloodType: "O+",
        age: "40 years",
        gender: "Male",
        phone: "(555) 123-4567",
        email: "john.smith@email.com"
    },
    summary: {
        chronicDiseases: 2,
        surgeries: 1,
        medications: 2,
        allergies: 1
    },
    history: {
        chronicDiseases: [
            { id: 1, name: "Type 2 Diabetes", date: "Diagnosed: May 10, 2018" },
            { id: 2, name: "Hypertension", date: "Diagnosed: Feb 15, 2020" }
        ],
        surgeries: [
            {
                id: 1,
                name: "Appendectomy",
                date: "Date: Aug 22, 2015",
                hospital: "Hospital: City General Hospital",
                notes: "Notes: Uncomplicated procedure, full recovery"
            }
        ],
        medications: [
            {
                id: 1,
                name: "Metformin",
                dosage: "500mg",
                frequency: "Frequency: Twice daily",
                started: "Started: May 10, 2018"
            },
            {
                id: 2,
                name: "Lisinopril",
                dosage: "10mg",
                frequency: "Frequency: Once daily",
                started: "Started: Feb 15, 2020"
            }
        ],
        allergies: [
            {
                id: 1,
                name: "Penicillin",
                reaction: "Reaction: Rash and itching"
            }
        ]
    }
};
