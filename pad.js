const cities = [
  {
    city: "Gold Coast",
    state: "Queensland",
  },
  {
    city: "Newcastle",
    state: "New South Wales",
  },
  {
    city: "Sunshine Coast",
    state: "Queensland",
  },
  {
    city: "Wollongong",
    state: "New South Wales",
  },
  {
    city: "Hobart",
    state: "Tasmania",
  },
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

console.log(shuffleArray(cities));
