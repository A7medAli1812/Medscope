import React, { useState, useEffect } from 'react';
import { getNotes } from '../services/notesService';
import Loader from '../../components/Loader';


const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const data = await getNotes();
                setNotes(data || []);
            } catch (err) {
                console.error("Failed to load notes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    if (loading) {
        return (
            <div style={{ position: 'relative', width: '100%', minHeight: '50vh' }}>
                <Loader message="Loading Notes..." />
            </div>
        );
    }

    return (
        <>

        <div>
            <h2 className="mb-4">Notes</h2>
            
            {notes.length === 0 ? (
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <p className="text-muted mb-0">No notes available at the moment.</p>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {notes.map((note, index) => (
                        <div className="card shadow-sm border-0" key={note.id || index}>
                            <div className="card-body">
                                <h5 className="card-title text-primary">{note.title || 'Note'}</h5>
                                {(note.date || note.createdAt) && (
                                    <h6 className="card-subtitle mb-2 text-muted">{note.date || note.createdAt}</h6>
                                )}
                                <p className="card-text mb-0 mt-2">
                                    {note.content || note.text || note.description || ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
};

export default Notes;
