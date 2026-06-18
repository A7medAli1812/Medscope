import axiosInstance from '../../api/axiosInstance';

const BASE = '/patient/notes';

export const getNotes = async () => {
    try {
        const { data } = await axiosInstance.get(BASE);
        const result = data?.data || data?.result || data;

        console.log('[NotesService] Raw API response:', result);
        
        if (!Array.isArray(result)) {
            return [];
        }
        
        // Map API fields to what the UI expects
        return result.map(note => ({
            id: note.id,
            title: note.diagnosis || 'Note',
            date: note.date || '',
            content: [
                note.treatmentPlan ? `Treatment: ${note.treatmentPlan}` : '',
                note.followUp ? `Follow-up: ${note.followUp}` : ''
            ].filter(Boolean).join(' | ') || note.content || note.text || ''
        }));
    } catch (error) {
        console.error('[NotesService] Error fetching notes:', error);
        throw error;
    }
};
