import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import PieChart from '../components/PieChart';
import Pet from '../components/Pet';
import JournalList from '../components/JournalList';
import { useUser } from '../context/UserContext';
import '../styles/Home.css';

const sampleData = [
  { name: 'Happiness', value: 90 },
  { name: 'Anger', value: 12 },
  { name: 'Fear', value: 34 },
  { name: 'Disgust', value: 53 },
  { name: 'Sadness', value: 98 },
];

const yourBackendValue = 0;

function Home() {
    const { fetchJournals } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    const handleSeeAllClick = () => {
        navigate('/journal');
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
                            <p>Calendar</p>
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
                            <JournalList limit={6} />
                        </div>
                    </div>
                </div>
            </div>
            <FloatingActionButton />
        </div>
    );
}

export default Home;