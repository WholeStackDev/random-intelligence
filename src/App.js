import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import styles from "./style.module.css";
import dict from "./websters.json";

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

function App() {
  const spaceProbability = 0.25;

  const [resultsSampleArray, setResultsSampleArray] = useState([]);

  const [stringLength, setStringLength] = useState(45);

  const [reportInterval, setReportInterval] = useState(1000);
  const [multiLetterFactor, setMultiLetterFactor] = useState(1.5);
  const [topListMaxLength, setTopListMaxLength] = useState(20);

  const [topList, setTopList] = useState([]);
  const topListRef = useRef(topList);
  topListRef.current = topList;

  const [runs, setRuns] = useState(0);
  const runsRef = useRef(runs);
  runsRef.current = runs;

  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const [bestResult, setBestResult] = useState({ score: 0, string: "" });
  const bestResultRef = useRef(bestResult);
  bestResultRef.current = bestResult;

  useEffect(() => {
    if (isRunning) {
      loop();
    }
  }, [isRunning]);

  const startRunning = () => {
    setIsRunning(true);
  };

  const stopRunning = () => {
    setIsRunning(false);
  };

  const loop = () => {
    if (isRunningRef.current) {
      multipleAttempts(reportInterval);
      setTimeout(loop, 20);
    }
  };

  const multipleAttempts = attempts => {
    let earlyExit = false;
    for (let step = 1; step <= attempts; step++) {
      let newScore = singleAttempt();
      if (newScore) {
        setRuns(runsRef.current + step);
        earlyExit = true;
        break;
      }
    }
    if (earlyExit === false) {
      setRuns(runsRef.current + reportInterval);
    }
  };

  const singleAttempt = () => {
    let currentString = "";

    for (let step = 1; step <= stringLength; step++) {
      if (Math.random() < spaceProbability) {
        currentString += " ";
      } else {
        currentString += String.fromCharCode(getRandomNumber(65, 90));
      }
    }

    let currentTrimmedString = currentString.replace(/\s+/g, " ").trim();
    let currentStringArray = currentTrimmedString.split(" ");

    let currentScore = 0;

    currentStringArray.forEach(str => {
      if (dict[str]) {
        currentScore += str.length ^ multiLetterFactor;
      }
    });
    if (topListRef.current.length < topListMaxLength || currentScore > topListRef.current[topListRef.current.length - 1].score) {
      addToTopList({
        score: currentScore,
        string: currentTrimmedString
      });
      return true;
    }
    return false;
  };

  const addToTopList = newTrial => {
    let newTrialSplit = newTrial.string.split(" ");
    let newTrialWords = [];
    newTrialSplit.forEach(str => {
      let isWord = dict[str] ? true : false;
      newTrialWords.push({ word: str, isWord: isWord });
    });
    newTrial.words = newTrialWords;

    let added = [...topListRef.current, newTrial];
    let sorted = added.sort(compareScore);
    sorted.splice(topListMaxLength, 5);
    setTopList(sorted);
  };

  const compareScore = (a, b) => {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  };

  const TopScores = () => {
    const listItems = topList.map(str => (
      <p key={str.string}>
        {DisplayString(str)}
        <span> - </span>
        <span>{str.score}</span>
      </p>
    ));
    return <div className={styles.results}>{listItems}</div>;
  };

  const DisplayString = str => {
    const spans = str.words.map((word, index) => (
      <span key={index} style={word.isWord ? { fontWeight: "900" } : { fontWeight: "400" }}>
        {word.word}{" "}
      </span>
    ));
    return spans;
  };

  const DisplayRuns = () => {
    return <p>{runs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>;
  };

  return (
    <div className="App">
      <h1>Random Intelligence</h1>
      <h2 className="subtitle">A simulation to conceptualize the difficulty of evolution</h2>
      <p>
        We've all been told that all life came about purely by random chance. This application is designed to illustrate the
        improbability of that assertion.
      </p>
      <p>
        When you hit start, your computer will begin generating strings roughly 50 characters in length. There is a 25%
        probability of getting a space rather than a character and all extra spaces are removed (we'll cheat like that just a bit
        to give evolution a hand). Each string will be checked for words against the webster's dictionary and the best ones will
        be shown.
      </p>
      <p>
        Note: It starts off very slow (because the ranking part is slow), but it speeds up a ton when it isn't updating the top
        scorers every other second.
      </p>
      {/* <button onClick={run}>Run</button> */}
      <button onClick={startRunning}>Start Running</button>
      <button onClick={stopRunning}>Stop Running</button>
      {/* <h2>Summary</h2>
      <p>
        <span>Valid Characters</span>
        <span>{totalValidCharacters}</span>
      </p>
      <h2>Results Sample</h2>
      <ResultsSample /> */}
      <DisplayRuns />
      <TopScores />
    </div>
  );
}

export default App;
