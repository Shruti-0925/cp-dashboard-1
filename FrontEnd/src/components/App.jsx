import React from "react";
import Login,{userlogged} from "./Login";
import Register from "./Register";
import LeaderBoard from "./LeaderBoard";
import PrevStandings from "./PrevStandings";
import Admin from "./admin";
import { Routes , Route } from "react-router-dom";

import PrivateRoute from "./privateRoute.js";

class App extends React.Component {
  constructor(props){
    super(props);

    this.state={
      current_user:userlogged
    };
  }
  render(){return (
    <div className="container">
      <Routes>
        <Route exact path='/' element={<PrivateRoute />}>
          <Route exact path='/prevstandings' element={<PrevStandings current_user={this.state.current_user}/>}/>
          <Route 
          exact path='/' element={<LeaderBoard current_user={this.state.current_user}/>}/>
        </Route>
        <Route exact path='/admin' element={<Admin />}/>
        <Route exact path="/login" element={<Login />}/>
        <Route exact path="/register" element={<Register />}/>
      </Routes>
    </div>
  )}
}

export default App;