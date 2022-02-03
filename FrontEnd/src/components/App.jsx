import React from "react";
import Login from "./Login";
import Register from "./Register";
import LeaderBoard from "./LeaderBoard";
import PrevStandings from "./PrevStandings";
import { Routes , Route } from "react-router-dom";

import PrivateRoute from "./privateRoute.js";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route exact path='/' element={<PrivateRoute />}>
          <Route exact path='/prevstandings' element={<PrevStandings />}/>
          <Route exact path='/' element={<LeaderBoard />}/>
        </Route>
        <Route exact path="/login" element={<Login />}/>
        <Route exact path="/register" element={<Register />}/>
      </Routes>
    </div>
  );
}

export default App;