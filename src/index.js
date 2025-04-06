document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");
  
    let allDogs = [];
    let filterOn = false;
  
    // Fetch and render all dogs
    function fetchDogs() {
      fetch("http://localhost:3000/pups")
        .then((res) => res.json())
        .then((dogs) => {
          allDogs = dogs;
          renderDogBar();
        });
    }
  
    // Render dog bar depending on filter
    function renderDogBar() {
      dogBar.innerHTML = "";
      const dogsToShow = filterOn
        ? allDogs.filter((dog) => dog.isGoodDog)
        : allDogs;
  
      dogsToShow.forEach((dog) => {
        const span = document.createElement("span");
        span.textContent = dog.name;
        span.addEventListener("click", () => showDogInfo(dog));
        dogBar.appendChild(span);
      });
    }
  
    // Render dog info when a span is clicked
    function showDogInfo(dog) {
      dogInfo.innerHTML = `
        <img src="${dog.image}" />
        <h2>${dog.name}</h2>
        <button>${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
      `;
  
      const toggleButton = dogInfo.querySelector("button");
      toggleButton.addEventListener("click", () => toggleDogGoodness(dog));
    }
  
    // Toggle the "goodness" of a dog and update the database
    function toggleDogGoodness(dog) {
      const newStatus = !dog.isGoodDog;
  
      fetch(`http://localhost:3000/pups/${dog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isGoodDog: newStatus,
        }),
      })
        .then((res) => res.json())
        .then((updatedDog) => {
          // Update local array
          const index = allDogs.findIndex((d) => d.id === updatedDog.id);
          allDogs[index] = updatedDog;
  
          showDogInfo(updatedDog);
          renderDogBar();
        });
    }
  
    // Filter toggle
    filterButton.addEventListener("click", () => {
      filterOn = !filterOn;
      filterButton.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
      renderDogBar();
    });
  
    // Initial load
    fetchDogs();
  });
  