import React, { useEffect, useState } from 'react';
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
import api from '../api';

const moodToEmotionCode = {
  anger: 1,
  disgust: 2,
  fear: 3,
  happy: 4,
  sad: 5,
};

const sampleMoodData = {
    '2025-06-01': 'happy',
    '2025-06-02': 'sad',
    '2025-06-03': 'angry',
    '2025-06-04': 'fear',
    '2025-06-05': 'disgust',
};

function Home() {
    const { fetchJournals, journals, loading } = useUser();
    const navigate = useNavigate();
    const [moodStats, setMoodStats] = useState(null);
    const [yourBackendValue, setYourBackendValue] = useState(4); // default to happy

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    // Fetch mood stats for the most recent journal entry
    useEffect(() => {
        const fetchMoodStats = async () => {
            if (journals.length > 0) {
                try {
                    const mostRecentJournal = journals[0];
                    const response = await api.get(`/journals/${mostRecentJournal.id}/`);
                    if (response.data.moodStats) {
                        setMoodStats(response.data.moodStats);
                        // Set the emotion code based on dominant mood
                        if (response.data.moodStats.dominantMood) {
                            setYourBackendValue(moodToEmotionCode[response.data.moodStats.dominantMood.toLowerCase()] || 4);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching mood stats:', error);
                }
            }
        };

        if (!loading && journals.length > 0) {
            fetchMoodStats();
        }
    }, [journals, loading]);

    const handleSeeAllClick = () => {
        navigate('/journal');
    };

    const handleCreateEntryClick = () => {
        navigate('/entry/new');
    };

    // Convert mood stats to chart data format
    const getChartData = () => {
        if (!moodStats) return [
            { name: 'Happiness', value: 0 },
            { name: 'Anger', value: 0 },
            { name: 'Fear', value: 0 },
            { name: 'Disgust', value: 0 },
            { name: 'Sadness', value: 0 },
        ];

        return [
            { name: 'Happiness', value: parseFloat(moodStats.percentHappiness.toFixed(2)) },
            { name: 'Anger', value: parseFloat(moodStats.percentAnger.toFixed(2)) },
            { name: 'Fear', value: parseFloat(moodStats.percentFear.toFixed(2)) },
            { name: 'Disgust', value: parseFloat(moodStats.percentDisgust.toFixed(2)) },
            { name: 'Sadness', value: parseFloat(moodStats.percentSadness.toFixed(2)) },
        ];
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
                        <PieChart data={getChartData()} emotionCode={yourBackendValue}/>
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