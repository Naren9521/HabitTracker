import { useEffect, useState, useRef } from 'react';
import './App.css';
import { Chart } from 'chart.js/auto';
import drinkWaterIcon from './assets/drinkginwater.png';
import footstepIcon from './assets/footsteps.png';
import swimIcon from './assets/swim.png';
import yogaIcon from './assets/yoga.png';

const App = () => {
  const maxValues = { water: 3000, steps: 8000, yoga: 60, swim: 60 };
  const [waterAmount, setWaterAmount] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [yogaTime, setYogaTime] = useState(0);
  const [swimTime, setSwimTime] = useState(0);
  const [calorieData, setCalorieData] = useState([200, 400, 300]);

  const [selectedActivities, setSelectedActivities] = useState({
    reading: false,
    revision: false,
    cleaning: false,
    movie: false,
  });

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const randomIncrement = (habit) => {
    if (habit === 'water') return Math.floor(Math.random() * 50 + 20);
    if (habit === 'steps') return Math.floor(Math.random() * 100 + 50);
    if (habit === 'yoga') return Math.floor(Math.random() * 3 + 1);
    if (habit === 'swim') return Math.floor(Math.random() * 5 + 1);
    return 0;
  };

  const loadAndIncrementHabits = () => {
    const previousWater = parseInt(localStorage.getItem('waterAmount')) || 0;
    const previousSteps = parseInt(localStorage.getItem('stepCount')) || 0;
    const previousYoga = parseInt(localStorage.getItem('yogaTime')) || 0;
    const previousSwim = parseInt(localStorage.getItem('swimTime')) || 0;

    const newWaterAmount = Math.min(previousWater + randomIncrement('water'), maxValues.water);
    const newStepCount = Math.min(previousSteps + randomIncrement('steps'), maxValues.steps);
    const newYogaTime = Math.min(previousYoga + randomIncrement('yoga'), maxValues.yoga);
    const newSwimTime = Math.min(previousSwim + randomIncrement('swim'), maxValues.swim);

    setWaterAmount(newWaterAmount);
    setStepCount(newStepCount);
    setYogaTime(newYogaTime);
    setSwimTime(newSwimTime);

    localStorage.setItem('waterAmount', newWaterAmount);
    localStorage.setItem('stepCount', newStepCount);
    localStorage.setItem('yogaTime', newYogaTime);
    localStorage.setItem('swimTime', newSwimTime);
  };

  useEffect(() => {
    loadAndIncrementHabits();

    const savedActivities = JSON.parse(localStorage.getItem('selectedActivities')) || {
      reading: false,
      revision: false,
      cleaning: false,
      movie: false,
    };
    setSelectedActivities(savedActivities);

    const ctx = chartRef.current.getContext('2d');
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Morning', 'Afternoon', 'Evening'],
        datasets: [
          {
            label: 'Calories',
            data: calorieData,
            borderColor: '#333',
            backgroundColor: '#a8e6cf',
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, []);

  const updateCalorieData = () => {
    setCalorieData([
      150 + waterAmount * 0.05 + (selectedActivities.reading ? 20 : 0),
      300 + stepCount * 0.03 + (selectedActivities.revision ? 30 : 0),
      250 + swimTime * 0.5 + yogaTime * 10 + (selectedActivities.movie ? 40 : 0),
    ]);
  };

  useEffect(() => {
    updateCalorieData();
  }, [waterAmount, stepCount, yogaTime, swimTime, selectedActivities]);

  // New useEffect to update the chart whenever calorieData changes
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.datasets[0].data = calorieData;
      chartInstanceRef.current.update();
    }
  }, [calorieData]);

  const handleCheckboxChange = (activity) => {
    setSelectedActivities((prev) => {
      const updatedActivities = { ...prev, [activity]: !prev[activity] };
      localStorage.setItem('selectedActivities', JSON.stringify(updatedActivities));
      return updatedActivities;
    });
  };

  const resetHabits = () => {
    setWaterAmount(0);
    setStepCount(0);
    setYogaTime(0);
    setSwimTime(0);
    setCalorieData([200, 400, 300]);
    setSelectedActivities({
      reading: false,
      revision: false,
      cleaning: false,
      movie: false,
    });
    localStorage.clear();
  };

  const getProgress = (value, max) => `${(value / max) * 100}%`;

  return (
    <div className="widget-container">
      <div className="tracker-card">
        <h3>Calorie Tracker</h3>
        <canvas ref={chartRef} id="calorieChart"></canvas>
      </div>

      <div className="activity-card water-card" style={{ background: `linear-gradient(to right, #00bfff ${getProgress(waterAmount, maxValues.water)}, #ccc 0%)` }}>
        <img src={drinkWaterIcon} alt="Water Icon" />
        <p>Water</p>
        <h4>{waterAmount} ML</h4>
      </div>

      <div className="activity-card steps-card" style={{ background: `linear-gradient(to right, #80cbc4 ${getProgress(stepCount, maxValues.steps)}, #ccc 0%)` }}>
        <img src={footstepIcon} alt="Footstep Icon" />
        <p>Step Count</p>
        <h4>{stepCount} Steps</h4>
      </div>

      <div className="activity-card yoga-card" style={{ background: `linear-gradient(to right, #f8b195 ${getProgress(yogaTime, maxValues.yoga)}, #ccc 0%)` }}>
        <img src={yogaIcon} alt="Yoga Icon" />
        <p>Yoga</p>
        <h4>{yogaTime} min</h4>
      </div>

      <div className="activity-card swim-card" style={{ background: `linear-gradient(to right, #ffe082 ${getProgress(swimTime, maxValues.swim)}, #ccc 0%)` }}>
        <img src={swimIcon} alt="Swim Icon" />
        <p>Swim</p>
        <h4>{swimTime} min</h4>
      </div>

      <div className="activity-checkboxes">
        <h4>Select Additional Activities</h4>
        {Object.keys(selectedActivities).map((activity) => (
          <label key={activity}>
            <input
              type="checkbox"
              checked={selectedActivities[activity]}
              onChange={() => handleCheckboxChange(activity)}
            />
            {activity.charAt(0).toUpperCase() + activity.slice(1)}
          </label>
        ))}
      </div>

      <button onClick={resetHabits}>Reset Habits</button>
    </div>
  );
};

export default App;
