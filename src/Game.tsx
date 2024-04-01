// this could use comments. anyone wanna do that for me?

import {useState, useEffect} from 'react';
import './Game.css';

interface squareProps {
    value: string;
    completed: boolean;
    color: number;
    delay: number;
}

interface rowProps {
    guess: string[];
    completed: boolean;
    colors: number[];
}

interface gameProps {
    list: Set<string>;
    word: string;
}

interface wordProps {
    done: boolean;
    word: string;
}

function Square({value, completed, color, delay}:squareProps) {
    let colorName = "";
    if(completed && color === 0) colorName = " animation-grey"
    else if(completed && color === 1) colorName = " animation-yellow";
    else if(completed && color === 2) colorName = " animation-green";
    return (
        <div className={`square${colorName}`} style={{animationDelay: `${delay}ms`}}>
            <p>{value}</p>
        </div>
    );
}

function Row({guess, completed, colors}:rowProps) {
    return (
        <div className="row">
            {guess.map((letter, i) => 
                <Square key={i} value={letter} completed={completed} color={colors[i]} delay={500*i}/>
            )}
        </div>
    )
}

export default function Game({word, list}:gameProps) {
    const [guesses, setGuesses] = useState(Array(6).fill(Array(5).fill("")));
    const [completed, setCompleted] = useState(Array(6).fill(false));
    const [colors, setColors] = useState(Array(6).fill(Array(5).fill(0)))
    const [index, setIndex] = useState(0);
    const [done, setDone] = useState(false);
    const row = Math.floor(index/5);
    const col = index%5;
    
    // ok
    function handleKeyDown(e:any) {
        let key:string = e.key;
        let code:number = key.charCodeAt(0);
        if(e.ctrlKey) return;
         
        if(e.keyCode === 13 && index > 0 && index%5 === 0) {
            let guess = guesses[row-1];
            if(!list.has(guess.join("").toLowerCase())) return;
            setCompleted((completed) => {
                let newCompleted = [...completed];
                completed[row-1] = true;
                return newCompleted;
            });

            const evaluation:number[] = checkWord(guess, word);
            setColors((colors) => {
                let newColors:number[][] = new Array(6);
                for(let i=0; i<6; i++) {
                    if(i === row-1) newColors[i] = [...evaluation];
                    else newColors[i] = colors[i];
                }
                return newColors;
            });

            let allCorrect = true;
            for(let i=0; i<5; i++) {
                if(evaluation[i] !== 2) {
                    allCorrect = false;
                    break;
                }
            }
            if(allCorrect) {
                setDone(true);
            } else if(index === 30) {
                setDone(true);
            }
        } else if(e.keyCode === 8 && index > 0) {
            const newRow = Math.floor((index-1)/5);
            const newCol = (index-1)%5;

            if(!completed[newRow]) {
                setGuesses((guesses) => {
                    let newGuesses:string[][] = new Array(6);
                    for(let i=0; i<6; i++) {
                        newGuesses[i] = [...guesses[i]];
                    }
                    newGuesses[newRow][newCol] = "";
                    setIndex(index-1);
                    return newGuesses;
                });
            }
        } else if(index < 30 && key.length === 1 && ((code > 64 && code < 91) ||
                                                   (code > 96 && code < 123))) {
            if(e.repeat) return;
            if(row === 0 || (row > 0 && completed[row-1])) {
                setGuesses((guesses) => {
                    let newGuesses:string[][] = new Array(6);
                    for(let i=0; i<6; i++) {
                        newGuesses[i] = [...guesses[i]];
                    }
                    newGuesses[row][col] = key.toUpperCase();
                    setIndex(index+1);
                    return newGuesses;
                });
            }
        }
    }

    useEffect(() => {
        if(!done) {
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            }
        }
    });

    return (
        <div className="game">
            <Row guess={guesses[0]} completed={completed[0]} colors={colors[0]}/>
            <Row guess={guesses[1]} completed={completed[1]} colors={colors[1]}/>
            <Row guess={guesses[2]} completed={completed[2]} colors={colors[2]}/>
            <Row guess={guesses[3]} completed={completed[3]} colors={colors[3]}/>
            <Row guess={guesses[4]} completed={completed[4]} colors={colors[4]}/>
            <Row guess={guesses[5]} completed={completed[5]} colors={colors[5]}/>
            <Word done={done} word={word}/>
        </div>
    )
}

function Word({done, word}:wordProps) {
    let visibility = "hide";
    if(done) visibility = "appear";
    return <h3 className={visibility}>{`The word was ${word}`}</h3>;
}

function checkWord(guess:string[], word:string):number[] {
    // both guess and word are single words, but are stored differently. why? well,
    const wordSet = new Set(word);
    const evaluation:number[] = new Array(5).fill(0);
    guess.forEach((letter, i) => {
        if(word.split("")[i] === letter.toLowerCase()) evaluation[i] = 2;
        else if(wordSet.has(letter.toLowerCase())) evaluation[i] = 1;
    });

    return evaluation;
}