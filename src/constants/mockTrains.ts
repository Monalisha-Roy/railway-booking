import { Train } from '@/types/types';

export const mockTrains: Train[] = [
    {
        id: '1',
        name: 'Rajdhani Express',
        departure: 'Delhi',
        arrival: 'Mumbai',
        duration: '16h',
        price: 2500,
        seatsAvailable: 50,
    },
    {
        id: '2',
        name: 'Shatabdi Express',
        departure: 'Delhi',
        arrival: 'Chandigarh',
        duration: '3h 30m',
        price: 800,
        seatsAvailable: 120,
    },
    {
        id: '3',
        name: 'Duronto Express',
        departure: 'Kolkata',
        arrival: 'Delhi',
        duration: '17h',
        price: 2200,
        seatsAvailable: 75,
    },
    {
        id: '4',
        name: 'Garib Rath',
        departure: 'Mumbai',
        arrival: 'Jaipur',
        duration: '18h',
        price: 1500,
        seatsAvailable: 100,
    },
    {
        id: '5',
        name: 'Intercity Express',
        departure: 'Bangalore',
        arrival: 'Chennai',
        duration: '5h',
        price: 600,
        seatsAvailable: 200,
    },
];