import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import PieChart from '../components/PieChart';
import Pet from '../components/Pet';
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
    return (
        <div>
            <NavigationBar />
            <div className="home-container">
                <div className="home-pet-section">
                    <Pet emotionCode={yourBackendValue} />
                    <div className="mallow-pet-label">Mallow Pet</div>
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
                        <div className="recent-entries-box-header">Recent Entries</div>
                    </div>
                </div>
            </div>
            <FloatingActionButton />
        </div>
    );
}

export default Home;