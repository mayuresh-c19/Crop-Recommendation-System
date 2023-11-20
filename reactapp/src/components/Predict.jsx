import React, { useState } from "react";
// import firebase from './Firebaseconfig';
import { db } from '../../firebaseConfig';
import { ref, push, set } from 'firebase/database';
import { json } from "react-router-dom";
import { jsPDF } from 'jspdf';


export const Predict = () => {
  const [prediction, setPrediction] = useState(null);
  const [N, setN] = useState('');
  const [P, setP] = useState('');
  const [K, setK] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [ph, setPh] = useState('');
  const [rainfall, setRainfall] = useState('');
  
  const predictCrop = async (event) => {
    event.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/predict/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `N=${N}&P=${P}&K=${K}&temperature=${temperature}&humidity=${humidity}&ph=${ph}&rainfall=${rainfall}`
    });
    const data = await response.json();
    // console.log(body);
    console.log(data);
    setPrediction(data.prediction);
  
    // // Make another POST request to save the prediction
    // const saveResponse = await fetch('http://127.0.0.1:8000/predict/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: `N=${N}&P=${P}&K=${K}&temperature=${temperature}&humidity=${humidity}&ph=${ph}&rainfall=${rainfall}&prediction=${data.prediction}`
    // });
    // const saveData = await saveResponse.json();
    // console.log(saveData);

    const predictionsRef = ref(db, 'predictions/');
    set(push(predictionsRef), {
      N: N,
      P: P,
      K: K,
      temperature: temperature,
      humidity: humidity,
      ph: ph,
      rainfall: rainfall,
      prediction: data.prediction
    }).catch(error => console.error('Error writing to Firebase: ', error));
    
    // Generate PDF
    const doc = new jsPDF();
    doc.text('N: ' + N, 10, 10);
    doc.text('P: ' + P, 10, 20);
    doc.text('K: ' + K, 10, 30);
    doc.text('Temperature: ' + temperature, 10, 40);
    doc.text('Humidity: ' + humidity, 10, 50);
    doc.text('pH: ' + ph, 10, 60);
    doc.text('Rainfall: ' + rainfall, 10, 70);
    doc.text('Prediction: ' + data.prediction, 10, 80);
    doc.save('Prediction.pdf');

  };

  

  return (
    <div className="w-full p-10 flex flex-col">
      <div className="text-gray-700 font-bold text-4xl flex flex-row justify-center">
        <h1>PREDICT</h1>
      </div>

      <div className="border-2 border-green-700 pb-5 pt-2 m-11 mx-20 shadow-2xl rounded-xl">
        <form className="w-full pr-10" onSubmit={predictCrop}>
          <div className="flex justify-evenly">
            <div className="flex flex-col w-20 ">
              <label className="self-center p-2 font-medium">Nitrogen</label>
              <input
                type="number"
                value={N}
                onChange={e => setN(e.target.value)}
                className="p-1 bg-gray-200 border border-green-800 rounded-md"
              />
            </div>
            <div className="flex flex-col w-20 ">
              <label className="self-center p-2 font-medium">Phosphorus</label>
              <input
                type="number"
                value={P}
                onChange={e => setP(e.target.value)}
                className="p-1 bg-gray-200 border border-green-800 rounded-md"
              />
            </div>
            <div className="flex flex-col w-20 ">
              <label className="self-center p-2 font-medium">Potassium</label>
              <input
                type="number"
                value={K}
                onChange={e => setK(e.target.value)}
                className="p-1 bg-gray-200 border border-green-800 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-around px-[20%]">
            <div className="flex flex-col justify-center pt-8">
              <label className="self-center p-2 font-medium ">
                Temperature 🌡️
              </label>
              <input
                type="number"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                className="p-1 bg-gray-200 border border-green-800 rounded-md"
              />
            </div>
          </div>

            <div className="flex flex-col justify-center pt-8">
              <label className="self-center p-2 font-medium">pH 🧪</label>
              <input
                type="number"
                value={ph}
                onChange={e => setPh(e.target.value)}
                className="px-4 w-[10%] h-9 bg-gray-200 border border-green-800 rounded-md self-center"
              />
            </div>
            
            <div className="flex justify-around px-[20%]">
            <div className="flex flex-col justify-center pt-8">
              <label className="self-center p-2 font-medium ">Rainfall 🌧️</label>
              <input
                type="number"
                value={rainfall}
                onChange={e => setRainfall(e.target.value)}
                className="px-4 w-[50%] h-9 bg-gray-200 border border-green-800 rounded-md self-center"
              />
            </div>
            <div className="flex flex-col justify-center pt-8">
              <label className="self-center p-2 font-medium ">Humidity ♨️</label>
              <input
                type="number"
                value={humidity}
                onChange={e => setHumidity(e.target.value)}
                className="px-4 w-[50%] h-9 bg-gray-200 border border-green-800 rounded-md self-center"
              />
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <button
              className="mt-9 w-20 h-10 bg-green-950 rounded-xl text-white"
              type="submit"
            >
              Predict
            </button>
          </div>
        </form>

        {/* Prediction goes here */}

        <div className={"flex flex-row justify-center pr-10 h-20 pt-7 text-2xl " + (prediction ? " block" : "hidden ")} >
          The data you provided suggests that you should cultivate: {prediction}
        </div>
      </div>
    </div>
  );
};