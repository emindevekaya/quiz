import React, { useEffect, useRef, useState } from "react";
import cartoonData from "../json/cartoon";
import faglarData from "../json/faglar";
import vagrenenData from "../json/vagrenen";
import "./App.css";
const images = require.context("../images/", true);
const jsons = require.context("../json/", true);

function App() {
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const correctRef = useRef();
  const wrongRef = useRef();
  const [theme, setTheme] = useState();
  const [topic, setTopic] = useState();
  const [answers, setAnswers] = useState();

  useEffect(() => {
    setTheme("cartoon");
    generateTopicAndAnswersFor("cartoon");
  }, []);

  function generateTopicAndAnswersFor(currentTheme) {
    let randomTopic = getRandomTopic(currentTheme);
    while (randomTopic === topic) {
      randomTopic = getRandomTopic(currentTheme);
    }
    setTopic(randomTopic);
    let randomAnswers = getRandomAnswers(3, [randomTopic.name], currentTheme);
    setAnswers(randomAnswers);
  }

  function getRandomTopic(currentTheme) {
    let themeData = getThemeData(currentTheme);
    let randomValue = parseInt(Math.random() * themeData.length + 1);
    return themeData[randomValue - 1];
  }

  function getThemeData(currentTheme) {
    if (currentTheme === "cartoon") {
      return cartoonData;
    } else if (currentTheme === "vagrenen") {
      return vagrenenData;
    } else if (currentTheme === "faglar") {
      return faglarData;
    }
    return null;
  }

  function getRandomAnswers(amount, answers, currentTheme) {
    let i = 0;
    while (i < amount) {
      let randomTopic = getRandomTopic(currentTheme);
      if (answers.indexOf(randomTopic.name) == -1) {
        answers.push(randomTopic.name);
        i++;
      }
    }

    return shuffle(answers);
  }

  function shuffle(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  function onClick(event) {
    if (event.target.outerText == topic.name) {
      setCorrectCount(correctCount + 1);
      playAnimation(correctRef);
      generateTopicAndAnswersFor(theme);
    } else {
      setWrongCount(wrongCount + 1);
      playAnimation(wrongRef);
    }
  }

  function onThemeChanged(event) {
    setTheme(event.target.value);
    generateTopicAndAnswersFor(event.target.value);
  }

  function playAnimation(ref) {
    ref.current.style.animation = "";
    setTimeout(() => {
      ref.current.style.animation = "pulse 1s";
    }, 0);
  }

  if (topic && answers) {
    return (
      <>
        <div className="theme-container" onChange={onThemeChanged}>
          <div>
            <input
              type="radio"
              id="cartoon"
              value="cartoon"
              name="theme"
              defaultChecked
            />
            <label htmlFor="cartoon" className="label-inline">
              Cartoon
            </label>
          </div>
          <div>
            <input type="radio" id="vagrenen" value="vagrenen" name="theme" />
            <label htmlFor="vagrenen" className="label-inline">
              Vägrenen
            </label>
          </div>
          <div>
            <input type="radio" id="faglar" value="faglar" name="theme" />
            <label htmlFor="faglar" className="label-inline">
              Fåglar
            </label>
          </div>
        </div>
        <div className="container">
          <div className="quiz-container">
            <img
              className="quiz-image"
              src={images(`./${topic.image}`).default}
            />
            <div className="answer-container">
              {answers.map((answer) => (
                <p className="answer" onClick={onClick} key={answer}>
                  {answer}
                </p>
              ))}
            </div>
            <div className="count-container">
              <div ref={correctRef}>✔️{correctCount}</div>
              <div ref={wrongRef}>❌{wrongCount}</div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return "";
  }
}

export default App;
