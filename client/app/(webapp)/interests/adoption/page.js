export default function AdoptionPage() {
  const dogs = [
    {
      id: 1,
      name: "Dog 1",
      breed: "Breed 1",
      age: "Age 1",
      size: "Size 1",
      description: "This is the first dog.",
      photo: "https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg",
    },
    {
      id: 2,
      name: "Dog 2",
      breed: "Breed 2",
      age: "Age 2",
      size: "Size 2",
      description: "This is the second dog.",
      photo: "https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg",
    },
  ];

  return (
    <div className="flex flex-col self-stretch">
      <h1 className="text-2xl font-bold text-center py-4">Adoption</h1>

      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        {/* {dogs.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))} */}
      </div>
    </div>
  );
}
