import React from 'react';
import DialogBox from './DialogBox';
import '../styles/Pet.css';
import IdleAnim from '../assets/GIFs/IdleAnim.gif';
import SimpleIdleAnim from '../assets/GIFs/SimpleIdleAnim.gif';
import HappyAnim from '../assets/GIFs/HappyAnim.gif';
import SadAnim from '../assets/GIFs/SadAnim.gif';
import AngryAnim from '../assets/GIFs/AngryAnim.gif';
import FearAnim from '../assets/GIFs/FearAnim.gif';
import DisgustAnim from '../assets/GIFs/DisgustAnim.gif';

const idleGifs = [IdleAnim, SimpleIdleAnim];

const emotionGifMap = {
  0: () => idleGifs[Math.floor(Math.random() * idleGifs.length)],
  1: () => idleGifs[Math.floor(Math.random() * idleGifs.length)],
  2: () => HappyAnim,
  3: () => SadAnim,
  4: () => AngryAnim,
  5: () => FearAnim,
  6: () => DisgustAnim,
};

const Pet = ({ emotionCode = 0 }) => {
  const getGif = () => {
    const fn = emotionGifMap[emotionCode];
    return fn ? fn() : idleGifs[Math.floor(Math.random() * idleGifs.length)];
  };

  const petGif = getGif();

  return (
    <div className="pet-container">
      <DialogBox message="Good Job! Take a rest now." />
      <img
        src={petGif}
        alt="Pet Animation"
        className="pet-gif"
      />
    </div>
  );
};

export default Pet;
