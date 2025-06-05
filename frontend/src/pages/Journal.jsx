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
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Journal() {
    const { fetchJournals } = useUser();
    const [search, setSearch] = React.useState('');
    const [filterDropdownOpen, setFilterDropdownOpen] = React.useState(false);
    const [selectedMood, setSelectedMood] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(null);
    const filterDropdownRef = React.useRef(null);
    const location = useLocation();

    const moodOptions = [
        { value: '', label: 'All Moods' },
        { value: 'happy', label: 'Happy' },
        { value: 'sad', label: 'Sad' },
        { value: 'anger', label: 'Angry' },
        { value: 'fear', label: 'Fear' },
        { value: 'disgust', label: 'Disgust' },
    ];

    // Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setFilterDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchJournals();
        // Get date from URL parameters
        const params = new URLSearchParams(location.search);
        const dateParam = params.get('date');
        if (dateParam) {
            setSearch(dateParam);
        }
    }, [fetchJournals, location.search]);

    useEffect(() => {
        document.body.style.overflowY = 'auto';
        return () => {
            document.body.style.overflowY = 'hidden';
        };
    }, []);

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
                    <div className="journal-filter-dropdown-container" ref={filterDropdownRef}>
                        <button
                            className="journal-filter-icon"
                            onClick={() => setFilterDropdownOpen(open => !open)}
                            aria-label="Filter"
                        >
                            <Icon icon="stash:filter-solid" width="24" height="24" />
                        </button>
                        {filterDropdownOpen && (
                            <div className="profile-dropdown journal-filter-dropdown">
                                <div className="filter-section">
                                    <label className="filter-label">Mood</label>
                                    <select
                                        className="filter-select"
                                        value={selectedMood}
                                        onChange={e => setSelectedMood(e.target.value)}
                                    >
                                        {moodOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-section">
                                    <label className="filter-label">Date</label>
                                    <Calendar
                                        calendarType="gregory"
                                        value={selectedDate}
                                        prevLabel={<Icon icon="lucide:circle-chevron-left" width="24" height="24" />}
                                                nextLabel={<Icon icon="lucide:circle-chevron-right" width="24" height="24" />}
                                        onChange={setSelectedDate}
                                        maxDetail="month"
                                        className="filter-calendar"
                                    />
                                    {selectedDate && (
                                        <button
                                            className="filter-clear-date"
                                            onClick={() => setSelectedDate(null)}
                                            type="button"
                                        >
                                            Clear Date
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <JournalList search={search} mood={selectedMood} date={selectedDate} />
            <FloatingActionButton />
        </div>
    );
}

export default Journal;