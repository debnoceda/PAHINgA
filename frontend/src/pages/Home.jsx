import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import PieChart from '../components/PieChart';
import Pet from '../components/Pet';
import JournalList from '../components/JournalList';
import Button from '../components/Button';
import DialogBox from '../components/DialogBox';
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

import toast from 'react-hot-toast'

const handleTestDailyGreeting = async () => {
    try {
        const response = await api.get('/daily-greetings/today/');
        if (response.data.greetings && response.data.greetings.length > 0) {
            // Show the first greeting in a toast or alert
            toast.success(response.data.greetings[0]);
            // Or use: alert(response.data.greetings[0]);
        } else {
            toast('No greeting found for this period.');
        }
    } catch (error) {
        toast.error('Failed to fetch daily greeting.');
    }
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
    const [calendarMoodData, setCalendarMoodData] = useState({});
    const [adviceMessages, setAdviceMessages] = useState([]);
    const [dailyGreetings, setDailyGreetings] = useState([]);
    const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0);
    const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    // Add useEffect for advice rotation
    useEffect(() => {
        if (adviceMessages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentAdviceIndex((prevIndex) => (prevIndex + 1) % adviceMessages.length);
        }, 15000); // Rotate every 15 seconds

        return () => clearInterval(interval);
    }, [adviceMessages]);

    // Add useEffect for daily greeting rotation
    useEffect(() => {
        if (dailyGreetings.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % dailyGreetings.length);
        }, 15000); // Rotate every 15 seconds

        return () => clearInterval(interval);
    }, [dailyGreetings]);

    const handleAdviceClick = () => {
        if (adviceMessages.length <= 1) return;
        setCurrentAdviceIndex((prevIndex) => (prevIndex + 1) % adviceMessages.length);
    };

    // Convert mood stats to calendar format
    const getCalendarMoodData = () => {
        if (!moodStats) return {};
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toLocaleDateString('en-US');
        
        // Convert dominant mood to lowercase for consistency
        const mood = moodStats.dominantMood.toLowerCase();
        
        return {
            [today]: mood
        };
    };

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
                        // Update calendar mood data
                        setCalendarMoodData(getCalendarMoodData());
                        // Set advice messages
                        const newAdviceMessages = response.data.insights?.advice_messages || [];
                        setAdviceMessages(newAdviceMessages);
                        // Set random initial index for advice
                        setCurrentAdviceIndex(Math.floor(Math.random() * newAdviceMessages.length));
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

    // Fetch daily greetings
    useEffect(() => {
        const fetchDailyGreetings = async () => {
            try {
                const response = await api.get('/daily-greetings/today/');
                if (response.data.greetings) {
                    const newGreetings = response.data.greetings;
                    setDailyGreetings(newGreetings);
                    // Set random initial index for greetings
                    setCurrentGreetingIndex(Math.floor(Math.random() * newGreetings.length));
                }
            } catch (error) {
                console.error('Error fetching daily greetings:', error);
            }
        };

        fetchDailyGreetings();

        // Set up interval to check for time period changes
        const checkInterval = setInterval(() => {
            fetchDailyGreetings();
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(checkInterval);
    }, []);

    const handleSeeAllClick = () => {
        navigate('/journal');
    };

    const handleCreateEntryClick = () => {
        navigate('/entry/new');
    };

    // Convert mood stats to chart data format
    const getChartData = () => {
        if (!moodStats) return [
            { name: 'Happiness', value: 20 },
            { name: 'Anger', value: 20 },
            { name: 'Fear', value: 20 },
            { name: 'Disgust', value: 20 },
            { name: 'Sadness', value: 20 },
        ];

        return [
            { name: 'Happiness', value: parseFloat(moodStats.percentHappiness.toFixed(2)) },
            { name: 'Anger', value: parseFloat(moodStats.percentAnger.toFixed(2)) },
            { name: 'Fear', value: parseFloat(moodStats.percentFear.toFixed(2)) },
            { name: 'Disgust', value: parseFloat(moodStats.percentDisgust.toFixed(2)) },
            { name: 'Sadness', value: parseFloat(moodStats.percentSadness.toFixed(2)) },
        ];
    };

    // Get emotion code for dominant mood
    const getDominantEmotionCode = () => {
        if (!moodStats || !moodStats.dominantMood) return 0; // default to neutral for no analysis
        console.log(moodToEmotionCode[moodStats.dominantMood.toLowerCase()] || 0)
        return moodToEmotionCode[moodStats.dominantMood.toLowerCase()] || 0;
    };

    return (
        <div>
            <NavigationBar />
            <div className="home-container">
                <div className="home-pet-section">
                    <Pet 
                        emotionCode={getDominantEmotionCode()} 
                        message={
                            dailyGreetings.length > 0 
                                ? dailyGreetings[currentGreetingIndex]
                                : adviceMessages.length > 0 
                                    ? adviceMessages[currentAdviceIndex]
                                    : "Be kind to yourself during this time."
                        }
                    />
                    <p>Mallow Pet</p>
                </div>
                <div className="home-content-top">
                    <div className="home-calendar-section card calendar-box">
                        <MoodCalendar moodData={calendarMoodData} />
                    </div>
                    <div className="home-pie-section">
                        <PieChart />
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