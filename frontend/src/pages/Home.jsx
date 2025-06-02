import { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';

function Home() {
    const [formValue, setFormValue] = useState('');
    const [error, setError] = useState('');

    return (
        <div>
            <NavigationBar />
            <h1>Home</h1>
            <FloatingActionButton />
        </div>
    );
}

export default Home;