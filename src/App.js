// Css
import './App.css';
//React
import { useCallback, useEffect, useState } from 'react';

//data
import { wordList, wordsList } from "./data/words";


//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
];

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words, setWords] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);
  const pickWordAndCategory = () => {
    // pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    // pick a random word

    const word = words[category][Math.floor(Math.random() * words[category].length)]


    return { word, category }
  }

  // Start game
  const startGame = () => {
    //clear letters states
    clearLetterStates()
    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    // fill states
    setPickedWord(word);
    setPickedCategory(category)
    setLetters(wordLetters)
    console.log(wordLetters);
    setGameStage(stages[1].name)
  }

  // process letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()
    if (guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)) {
      return
    }
    //push guesses letter or remove guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([])
  }

  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates([])
      setGameStage(stages[2].name)
    }
  }, [guesses]);


  // check win condition
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]
    // win conditional
    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore += 100)
      //restart the game with new word
      startGame();

    }

    console.log(uniqueLetters)

  }, [guessedLetters, letters]);
  // restart the game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
