import React, { useState } from "react";
import "./App.css";
import styles from "./style.module.css";
import dict from "./words_dictionary.json";

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

function App() {
  const spaceProbability = 0.25;
  let [resultsSampleArray, setResultsSampleArray] = useState([]);
  const [runs, setRuns] = useState(0);
  const [totalValidCharacters, setTotalValidCharacters] = useState(0);

  const run = () => {
    let test = dict['test'];
    // const dict = JSON.parse(dictJSON);
  // let test = dict['aa'];
    let count = 0;
    const resultsArray = [];

    let currentString = "";
    let currentTrimmedString = "";
    let currentStringArray = [];
    let currentValidWords = 0;
    let currentInvalidWords = 0;
    let currentSequentialWords = 0;
    let currentValidCharacters = 0;
    let runningValidCharacters = 0;

    for (let step = 1; step <= 10; step++) {
      currentValidWords = 0;
      currentInvalidWords = 0;
      currentString = "";
      currentValidCharacters = 0;

      for (let step = 1; step <= 50; step++) {
        if (Math.random() < spaceProbability) {
          currentString += " ";
        } else {
          currentString += String.fromCharCode(getRandomNumber(65, 90));
        }
      }
      currentTrimmedString = currentString.replace(/\s+/g, " ").trim();
      currentStringArray = currentTrimmedString.split(" ");

      currentStringArray.forEach(str => {
        if (dict[str]) {
          currentValidCharacters += str.length;
          currentValidWords++;
        } else {
          currentInvalidWords++;
        }
      });
      resultsArray.push(currentTrimmedString);
      runningValidCharacters += currentValidCharacters;
      count++;
    }
    setRuns(runs + count);
    setResultsSampleArray([...resultsSampleArray, ...resultsArray]);
    setTotalValidCharacters(runningValidCharacters);
  };

  const ResultsSample = () => {
    const listItems = resultsSampleArray.map(str => <p>{str}</p>);
    return <div className={styles.results}>{listItems}</div>;
  };

  return (
    <div className="App">
      <button onClick={run}>Run</button>
      <h2>Summary</h2>
      <p>
        <span>Valid Characters</span>
        <span>{totalValidCharacters}</span>
      </p>
      <h2>Results Sample</h2>
      <ResultsSample />
      <p>{runs}</p>
    </div>
  );
}

export default App;
