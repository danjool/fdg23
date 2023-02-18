import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [results, setResults] = useState(null)

  useEffect( () => {
    
    const callBackendAPI = async () => {
      console.log("ue")
      const response = await fetch('/express_backend');
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body.message) 
      }
      setResults(body)
    };
    if(!results) callBackendAPI()
  }, [results])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {JSON.stringify(results)}
        </p>
      </header>
    </div>
  );
}

export default App;
