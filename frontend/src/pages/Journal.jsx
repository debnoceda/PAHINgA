import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import Card from '../components/Card';
import JournalList from '../components/JournalList';
import { useUser } from '../context/UserContext';
import '../styles/Journal.css';
import { Icon } from '@iconify/react';

function Journal() {
    const { fetchJournals } = useUser();
    const [search, setSearch] = React.useState('');
    const location = useLocation();

    useEffect(() => {
        fetchJournals();
        // Get date from URL parameters
        const params = new URLSearchParams(location.search);
        const dateParam = params.get('date');
        if (dateParam) {
            setSearch(dateParam);
        }
    }, [fetchJournals, location.search]);

    return (
        <div>
            <NavigationBar />
            <div className="journal-header">
                <div className='journal-header-content'>
                    <p className="journal-title">
                        Your Journal Journey
                    </p>
                    <p className="journal-subtitle small-text">
                        A record of your reflections, one day at a time.
                    </p>
                </div>
                <div className="journal-searchbar">
                    <div className="journal-search-input-wrapper">
                        <span className="journal-search-icon">
                            <Icon icon="material-symbols:search-rounded" width="22" height="22" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search title, content..."
                            className="custom-input journal-search-input small-text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="journal-filter-icon">
                        <Icon icon="stash:filter-solid" width="24" height="24" />
                    </button>
                </div>
            </div>
            <JournalList search={search} />
            <FloatingActionButton />
        </div>
    );
}

export default Journal;