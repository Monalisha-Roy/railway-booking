export interface Train {
  id: string
  name: string
  departure: string
  arrival: string
  duration: string
  price: number
  seatsAvailable: number
}
  
  export interface Booking {
    id: string
    trainId: string
    date: string
    passengers: number
    status: 'confirmed' | 'cancelled'
  }


  // colors: {
  //   'text': '#0e121b',
  //   'background': '#f4f5fa',
  //   'primary': '#263a69',
  //   'secondary': '#7d97d9',
  //   'accent': '#2c58c9',
  //  },
