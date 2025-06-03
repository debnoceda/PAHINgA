import { useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import Card from '../components/Card';
import JournalList from '../components/JournalList';
import { useUser } from '../context/UserContext';

function Journal() {
    const { fetchJournals } = useUser();

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    return (
        <div>
            <NavigationBar />
            <JournalList />
            <FloatingActionButton />
        </div>
    );
}

export default Journal;