import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import PieChart from '../components/PieChart';

const sampleData = [
  { name: 'Happiness', value: 90 },
  { name: 'Anger', value: 12 },
  { name: 'Fear', value: 34 },
  { name: 'Disgust', value: 53 },
  { name: 'Sadness', value: 98 },
];

function Home() {
    return (
        <div>
            <NavigationBar />
            <h1>Home</h1>
            <PieChart width={250} height={250} data={sampleData} emotionCode={1}/>
            <FloatingActionButton />
        </div>
    );
}

export default Home;