import React from "react";
import Form from "./Form";
import LeaderBoard from "./LeaderBoard";
import { BrowserRouter as Router, Routes , Route } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Router>
          <Routes>
            <Route exact path="/login" element={<Form isRegistered={true} />}/>
            <Route exact path="/register" element={<Form isRegistered={false} />}/>
            <Route exact path="/leaderboard" element={<LeaderBoard />}/>

          </Routes>
      </Router>
    </div>
  );
}

export default App;
