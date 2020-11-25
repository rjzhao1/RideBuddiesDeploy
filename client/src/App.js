import React from 'react';
import {BrowserRouter as Router,Route} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import './index.css'

import "bootstrap/dist/css/bootstrap.min.css"

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/navbar.component";
import Landing from './components/pages/Landing.component';
import Login from './components/Auth/Login.components';
import Register from './components/Auth/Register.components';
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";

import RidesList from "./components/pages/list-rides.component";
import MyRidesList from "./components/pages/my-rides.component";
import AddRide from "./components/pages/add-rides.component";
import RidesHost from "./components/pages/ride-host.component"
import RideMap from "./components/pages/map.component"

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000; 

  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login";
  }
}



function App() {
  return (
    <Provider store={store}>
      <Router >
        <Navbar/>
            <Route path="/" exact component={Landing}></Route>
            <Route path="/register" exact component={Register}></Route>
            <Route path="/login" exact component={Login}></Route>
            <Route path="/rides" exact component={RidesList}></Route>
            <Route path="/rides/view/:id" exact component={RidesHost}></Route>
            <Route path="/map" exact component={RideMap}></Route>
            <PrivateRoute path="/rides/add" exact component={AddRide}></PrivateRoute>
            <PrivateRoute path="/rides/myRides" exact component={MyRidesList}></PrivateRoute>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            
       
      </Router>   
    </Provider>
  );
}

export default App;
