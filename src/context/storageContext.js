import React, { useEffect, useState } from "react";

const StorageStateContext = React.createContext(undefined);
const StorageActionsContext = React.createContext(undefined);

const CHALLENGE_KEY = "challenge_key";
const GRAVITY_KEY = "gravity_key";
const PRECISION_KEY = "precision_key";
const RESPONSE_KEY = "response_key";

const StorageProvider = ({ children }) => {
  function addChallengeScore(data) {
    let totalTargets = 0;
    let hits = 0;
    let time = data.targets[0] ? data.finishTime - data.targets[0].birth : 0;
    let accuracy = 0; // hits/totalTargets
    let precision = 0;
    let responseTime = 0;
    let speed = 0; // hits/time

    data.targets.forEach((target) => {
      if (target.birth < data.finishTime) {
        totalTargets++;
        if (target.isClicked) {
          hits++;
          responseTime = responseTime + target.clickedTime - target.birth;
          precision =
            precision +
            (target.clickR - target.pos.subtr(target.clickPos).mag()) /
              target.clickR;
        }
      }
    });

    responseTime = totalTargets === 0 ? 0 : responseTime / totalTargets;
    precision = hits === 0 ? 0 : (precision / hits) * 100;
    accuracy = totalTargets === 0 ? 0 : (hits / totalTargets) * 100;
    speed = time === 0 ? 0 : (hits / time) * 1000;

    const d = {
      timestamp: Date.now(),
      totalTargets,
      hits,
      time,
      accuracy,
      precision,
      responseTime,
      speed,
    };
    let prevScores = JSON.parse(window.localStorage.getItem(CHALLENGE_KEY));
    if (prevScores) {
      prevScores.push(d);
    } else {
      prevScores = [d];
    }
    window.localStorage.setItem(CHALLENGE_KEY, JSON.stringify(prevScores));
  }

  function addGravityScore(data) {
    let totalTargets = 0;
    let hits = 0;
    let time = data.targets[0] ? data.finishTime - data.targets[0].birth : 0;
    let accuracy = 0; // hits/totalTargets

    let responseTime = 0;
    let speed = 0; // hits/time

    data.targets.forEach((target) => {
      if (target.birth < data.finishTime) {
        totalTargets++;
        if (target.isClicked) {
          hits++;
          responseTime = responseTime + target.clickedTime - target.birth;
        }
      }
    });

    responseTime = totalTargets === 0 ? 0 : responseTime / totalTargets;

    accuracy = totalTargets === 0 ? 0 : (hits / totalTargets) * 100;
    speed = time === 0 ? 0 : (hits / time) * 1000;

    const d = {
      timestamp: Date.now(),
      totalTargets,
      hits,
      time,
      accuracy,
      responseTime,
      speed,
    };
    let prevScores = JSON.parse(window.localStorage.getItem(GRAVITY_KEY));
    if (prevScores) {
      prevScores.push(d);
    } else {
      prevScores = [d];
    }
    window.localStorage.setItem(GRAVITY_KEY, JSON.stringify(prevScores));
  }

  function addPrecisionScore(data) {
    let prevScores = JSON.parse(window.localStorage.getItem(PRECISION_KEY));
    if (prevScores) {
      prevScores.push(data);
    } else {
      prevScores = [data];
    }
    window.localStorage.setItem(PRECISION_KEY, JSON.stringify(prevScores));
  }

  function addResponseScore(data) {
    let prevScores = JSON.parse(window.localStorage.getItem(RESPONSE_KEY));
    if (prevScores) {
      prevScores.push(data);
    } else {
      prevScores = [data];
    }
    window.localStorage.setItem(RESPONSE_KEY, JSON.stringify(prevScores));
  }

  function getChallengeScore() {
    return JSON.parse(window.localStorage.getItem(CHALLENGE_KEY));
  }
  function getGravityScore() {
    return JSON.parse(window.localStorage.getItem(GRAVITY_KEY));
  }
  function getResponseScore() {
    return JSON.parse(window.localStorage.getItem(RESPONSE_KEY));
  }
  function getPrecisionScore() {
    return JSON.parse(window.localStorage.getItem(PRECISION_KEY));
  }

  function deleteData() {
    window.localStorage.setItem(CHALLENGE_KEY, JSON.stringify([]));
    window.localStorage.setItem(GRAVITY_KEY, JSON.stringify([]));
    window.localStorage.setItem(RESPONSE_KEY, JSON.stringify([]));
    window.localStorage.setItem(PRECISION_KEY, JSON.stringify([]));
  }

  return (
    <StorageStateContext.Provider value={{}}>
      <StorageActionsContext.Provider
        value={{
          addChallengeScore,
          addGravityScore,
          addPrecisionScore,
          addResponseScore,
          getChallengeScore,
          getGravityScore,
          getPrecisionScore,
          getResponseScore,
          deleteData,
        }}
      >
        {children}
      </StorageActionsContext.Provider>
    </StorageStateContext.Provider>
  );
};

const useStorageState = () => {
  const context = React.useContext(StorageStateContext);
  if (context === undefined) {
    throw new Error("useStorageState must be used within a StorageProvider");
  }

  return context;
};

const useStorageActions = () => {
  const context = React.useContext(StorageActionsContext);
  if (context === undefined) {
    throw new Error("useStorageActions must be used within a StorageProvider");
  }

  return context;
};

export { useStorageState, useStorageActions, StorageProvider };
