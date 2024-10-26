import { useEffect, useState, useRef } from 'react';
import './App.css';
import { Chart } from 'chart.js/auto';
import drinkWaterIcon from './assets/drinkginwater.png';
import footstepIcon from './assets/footsteps.png';
import swimicon from './assets/swim.png';
import yogaIcon from './assets/yoga.png';

const App = () => {
  const defaultWaterAmount = 2750;
  const defaultStepCount = 3000;
  const defaultYogaTime = 30;
  const defaultSwimTime = 2;
  const defaultCalorieData = [100, 300, 500];

  const [waterAmount, setWaterAmount] = useState(defaultWaterAmount);
  const [stepCount, setStepCount] = useState(defaultStepCount);
  const [yogaTime, setYogaTime] = useState(defaultYogaTime);
  const [swimTime, setSwimTime] = useState(defaultSwimTime);
  const [calorieData, setCalorieData] = useState(defaultCalorieData);

  const chartRef = useRef(null); // Ref for the chart instance
  const chartInstanceRef = useRef(null); // Ref for storing the chart instance

  const getAndIncrement = (key, incrementValue) => {
    let storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      storedValue = 0;
    } else {
      storedValue = parseInt(storedValue);
    }
    storedValue += incrementValue;
    localStorage.setItem(key, storedValue);
    return storedValue;
  };

  useEffect(() => {
    // Increment values only on the initial load
    const updatedWaterAmount = defaultWaterAmount + getAndIncrement('waterAmount', 100);
    const updatedStepCount = defaultStepCount + getAndIncrement('stepCount', 200);
    const updatedYogaTime = defaultYogaTime + getAndIncrement('yogaTime', 5);
    const updatedSwimTime = defaultSwimTime + getAndIncrement('swimTime', 1);
    const updatedCalorieData = [
      defaultCalorieData[0] + getAndIncrement('caloriesMorning', 20),
      defaultCalorieData[1] + getAndIncrement('caloriesAfternoon', 50),
      defaultCalorieData[2] + getAndIncrement('caloriesEvening', 80),
    ];

    setWaterAmount(updatedWaterAmount);
    setStepCount(updatedStepCount);
    setYogaTime(updatedYogaTime);
    setSwimTime(updatedSwimTime);
    setCalorieData(updatedCalorieData);

    // Initialize the chart only once
    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Morning', 'Afternoon', 'Evening'],
        datasets: [{
          label: 'Calories',
          data: updatedCalorieData,
          borderColor: '#333',
          backgroundColor: '#a8e6cf',
          fill: false,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []); // Empty array to run only on mount

  useEffect(() => {
    // Update chart data when calorieData changes
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.datasets[0].data = calorieData;
      chartInstanceRef.current.update();
    }
  }, [calorieData]);

  // Function to clear localStorage and reset values to default
  const clearLocalStorage = () => {
    localStorage.clear();
    setWaterAmount(defaultWaterAmount);
    setStepCount(defaultStepCount);
    setYogaTime(defaultYogaTime);
    setSwimTime(defaultSwimTime);
    setCalorieData(defaultCalorieData);
  };

  return (
    <div className="widget-container">
      {/* Calorie Tracker */}
      <div className="tracker-card">
        <h3>Calorie Tracker</h3>
        <canvas ref={chartRef} id="calorieChart"></canvas>
      </div>

      {/* Activity Cards */}
      <div className="activity-card water-card">
        <img src={drinkWaterIcon} alt="Water Icon" />
        <p>Water</p>
        <h4>{waterAmount} ML</h4>
      </div>

      <div className="activity-card steps-card">
        <img src={footstepIcon} alt="Footstep Icon" />
        <p>Step Count</p>
        <h4>{stepCount} Steps</h4>
      </div>

      <div className="activity-card yoga-card">
        <img src={yogaIcon} alt="Yoga Icon" />
        <p>Yoga</p>
        <h4>{yogaTime} min</h4>
      </div>

      <div className="activity-card swim-card">
        <img src={swimicon} alt="Swim Icon" />
        <p>Swim</p>
        <h4>{swimTime} hrs</h4>
      </div>

      <div className="activity-card other-card">
        <div>
          <p>Reading</p><span>✔</span>
        </div>
        <div>
          <p>Revision</p><span>✔</span>
        </div>
        <div>
          <p>Cleaning</p><span>✔</span>
        </div>
        <div>
          <p>Movie</p><span>✔</span>
        </div>
      </div>

      {/* Button to reset all data */}
      <button onClick={clearLocalStorage}>Reset Data</button>
    </div>
  );
};

export default App;
