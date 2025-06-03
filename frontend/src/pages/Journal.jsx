import React, { useRef, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import Card from '../components/Card';
import JournalList from '../components/JournalList';
import { useUser } from '../context/UserContext';
import '../styles/Journal.css';
import { Icon } from '@iconify/react';
import FilterDropdown from '../components/FilterDropdown';

function Journal() {
    const { fetchJournals } = useUser();
    const [search, setSearch] = React.useState('');
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

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
                    <div className="filter-container" ref={filterRef}>
                        <button
                            className="journal-filter-icon"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Icon icon="stash:filter-solid" width="24" height="24" />
                        </button>
                        <FilterDropdown
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                        />
                    </div>
                </div>
            </div>
            <JournalList search={search} />
            <FloatingActionButton />
        </div>
    );
}

export default Journal;