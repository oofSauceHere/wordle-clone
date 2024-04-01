// wait, hold on. "./Game" isnt a char, so why is it in single quot... oh. thats right. this is javascript. good god
import Game from './Game';
import './App.css';

import wordlist from './wordlist.txt';
const words = await fetch(wordlist).then(res => res.text());
const list = words.split("\n");

import allwordlist from './allwordlist.txt';
const allWords = await fetch(allwordlist).then(res => res.text());
const allList = allWords.split("\n");

function App() {
  const word = list[Math.floor(Math.random()*list.length)];
  return (
    <>
      <div className="container">
        <div>
          <h1>Wordle (but mine)</h1>
          <Game word={word} list={new Set(allList)}/>
        </div>
      </div>
      <img draggable="false" src="https://preview.redd.it/nf2pipoomuic1.jpeg?auto=webp&s=d1ba8e87218cf7705ea4cab7a076b978bddac36a"/>
    </>
  );
}

export default App;