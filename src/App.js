import { useState } from "react";

import MapView from "./components/mapping/Map";
import { Controls } from "./components/Controls";
import { searchResults } from "./components/searchResults";

function App() {
  const [switches, setSwitches] = useState({
    showRelationships: false,
    showPolyLines: false,
  });
  const [markers, setMarkers] = useState([]);
  const [selectedDataPoints, setSelectedDataPoints] = useState([]);

  return (
    <div style={{ padding: "1rem", display: "flex", flexFlow: "row nowrap" }}>
      <div
        style={{
          flexBasis: "10%",
          height: "auto",
          overFlowY: "scroll",
          padding: "1rem",
        }}
      >
        <Controls
          switches={switches}
          setSwitches={setSwitches}
          selectedDataPoints={selectedDataPoints}
          setSelectedDataPoints={setSelectedDataPoints}
          searchResults={searchResults}
        />
      </div>
      <div style={{ flexBasis: "100%" }}>
        <MapView
          searchResults={searchResults}
          switches={switches}
          setSwitches={setSwitches}
          markers={markers}
          setMarkers={setMarkers}
          selectedDataPoints={selectedDataPoints}
          setSelectedDataPoints={setSelectedDataPoints}
        />
      </div>
    </div>
  );
}

export default App;
