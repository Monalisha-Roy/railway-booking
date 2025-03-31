import { Train } from '@/types/types';

interface TrainListProps {
  trains: Train[]
  onSelect: (train: Train) => void
}

export default function TrainList({ trains, onSelect }: TrainListProps) {
  return (
    <div className="space-y-4">
      {trains.map((train) => (
        <div key={train.id} className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold">{train.name}</h3>
          <div className="flex justify-between mt-2">
            <div>
              <p>{train.departure} → {train.arrival}</p>
              <p className="text-gray-600">{train.duration}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{train.price}</p>
              <button 
                onClick={() => onSelect(train)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}