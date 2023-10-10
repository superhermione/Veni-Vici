import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [catData, setCatData] = useState(null);
  const [seenCats, setSeenCats] = useState([]);
  const [banList, setBanList] = useState([]);

  const fetchCatData = async () => {
    try {
      let response;
      do {
        response = await axios.get('https://api.thecatapi.com/v1/images/search', {
          headers: {
            'x-api-key': 'live_8Nl6bgBQeOMmxQXqsuBlh7GF2R7wm5YmUg4CSHueST09NxaPIjsFcThAo46xmCGf'
          }
        });
        const { url, breeds } = response.data[0];
        const breedData = { name: breeds[0]?.name, origin: breeds[0]?.origin, lifeSpan: breeds[0]?.life_span, temperament: breeds[0]?.temperament };
        if (!banList.some(banned => Object.values(banned).some(val => Object.values(breedData).includes(val)))) {
          if (breedData.name && breedData.origin && breedData.temperament && breedData.lifeSpan) {
            setCatData({ url, breedData });
            setSeenCats(prevCats => [...prevCats, { url, breedData }]);
            break;
          }
        }
      } 
      while (true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBanClick = (attribute, value) => {
    setBanList([...banList, { attribute, value }]);
  };

  return (
    <div className="wrapper">
      <header>
        <h1>Cat Heaven</h1>
      </header>
      <main>
        
      <section className="seen-section">
          <h2>Who have we seen so far? </h2>
          <div className="seen-cats">
            {seenCats.map((cat, index) => (
              <div className="seen-cat" key={index}>
                <p>{cat.breedData.name} from {cat.breedData.origin}</p>
                <img className="seen-cat-image" src={cat.url} alt={`Cat ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="cat-section">
          <h2>One click to dive into the Cat Heaven!🐱</h2>
          <button onClick={fetchCatData}>Discover</button>
          {catData && (
            <div className="cat-data">
              <img src={catData.url} alt="Random Cat" />
              <ul>
                {Object.entries(catData.breedData).map(([key, value]) => (
                  <li key={key}>
                    <button onClick={() => handleBanClick(key, value)}>Ban {key}</button>: {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <section className="ban-section">
          <h2>Ban List</h2>
          <h3>Select an attribute in your listing to ban it</h3>
          <ul>
            {banList.map((bannedAttribute, index) => (
              <li key={index}>Banned {bannedAttribute.attribute}: {bannedAttribute.value}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;