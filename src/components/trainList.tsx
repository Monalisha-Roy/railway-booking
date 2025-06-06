import { useEffect, useState } from 'react';

type Train = {
  train_id: number;
  train_name: string;
  arrival_time: string;
  departure_time: string;
  start_station_name: string;
  end_station_name: string;
  days_of_operation: string;
  base_price: string;
};

interface TrainListProps {
  onSelect: (train: Train) => void;
}

function useTrainList() {
  const [trains, setTrains] = useState<Train[]>([]);

  useEffect(() => {
    async function fetchTrains() {
      try {
        const response = await fetch('/api/listTrain');
        if (!response.ok) {
          throw new Error('Failed to fetch trains');
        }
        const data: Train[] = await response.json(); 
        setTrains(data);
      } catch (error) {
        console.error('Error fetching trains:', error);
      }
    }

    fetchTrains();
  }, []);

  return trains;
}


export default function TrainList({ onSelect }: TrainListProps) {
  const trains = useTrainList();

  return (
    <div className="space-y-4">
      {trains.map((train) => (
        <div key={train.train_id} className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold">{train.train_name}</h3>
          <div className="flex justify-between mt-2">
            <div>
              <h4>{train.start_station_name} --{'>'} {train.end_station_name}</h4>
              <p>{train.arrival_time}</p> 
              <p>{train.days_of_operation}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{train.base_price}</p>
              <button 
              onClick={() => {
                onSelect(train);
                window.location.href = `/booktickets?train_id=${train.train_id}`;
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
              Select
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
