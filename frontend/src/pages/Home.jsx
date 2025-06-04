import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import PieChart from '../components/PieChart';
import Pet from '../components/Pet';
import JournalList from '../components/JournalList';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import '../styles/Home.css';
import MoodCalendar from '../components/MoodCalendar';

const sampleData = [
  { name: 'Happiness', value: 90 },
  { name: 'Anger', value: 12 },
  { name: 'Fear', value: 34 },
  { name: 'Disgust', value: 53 },
  { name: 'Sadness', value: 98 },
];

const sampleMoodData = {
    '2025-06-01': 'happy',
    '2025-06-02': 'sad',
    '2025-06-03': 'angry',
    '2025-06-04': 'fear',
    '2025-06-05': 'disgust',
};

const yourBackendValue = 0;

function Home() {
    const { fetchJournals, journals, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    const handleSeeAllClick = () => {
        navigate('/journal');
    };

    const handleCreateEntryClick = () => {
        navigate('/entry/new');
    };

    return (
        <div>
            <NavigationBar />
            <div className="home-container">
                <div className="home-pet-section">
                    <Pet emotionCode={yourBackendValue} />
                    <p>Mallow Pet</p>
                </div>
                <div className="home-content-top">
                    <div className="home-calendar-section">
                        {/* Calendar Placeholder */}
                        <div className="calendar-box">
                            <MoodCalendar moodData={sampleMoodData} />
                        </div>
                    </div>
                    <div className="home-pie-section">
                        <PieChart data={sampleData} emotionCode={1}/>
                    </div>
                </div>
                <div className="home-content-bottom">
                    <div className="home-recent-section card">
                        <div className="recent-entries-box-header">
                            <p>Recent Entries</p>
                            <button className="see-all-btn" onClick={handleSeeAllClick}>
                                See All
                            </button>
                        </div>
                        <div className="recent-entries-content">
                            {loading ? (
                                <div className="recent-entries-empty-state">
                                    <p className="empty-state-text">Loading entries...</p>
                                </div>
                            ) : journals.length === 0 ? (
                                <div className="recent-entries-empty-state">
                                    <p className="empty-state-text">No journal entries yet</p>
                                    <p className="empty-state-subtext">Start your journaling journey by writing your first entry</p>
                                    <Button className="small-compact empty-state-btn" onClick={handleCreateEntryClick}>
                                        Write Your First Entry
                                    </Button>
                                </div>
                            ) : (
                                <JournalList limit={6} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <FloatingActionButton />
        </div>
    );
}

export default Home;