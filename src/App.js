import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import { auth } from "firebase/app";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import {
  Home,
  Login,
  AddNewItem,
  Purchase,
  Sales,
  StockSummary,
} from "./pages";

firebase.initializeApp({
  apiKey: "AIzaSyB72n9pfCNfcGsHFcLPLxGIHbOM2j1pcgc",
  authDomain: "stock-mgmt-3sanket3.firebaseapp.com",
  databaseURL: "https://stock-mgmt-3sanket3.firebaseio.com",
  projectId: "stock-mgmt-3sanket3",
  storageBucket: "stock-mgmt-3sanket3.appspot.com",
  messagingSenderId: "404925228391",
  appId: "1:404925228391:web:2cc30d3fed8c3c7f02fbc2",
  measurementId: "G-LWJWWYEEJL"
});
firebase.analytics();
function App() {
  const [user, setUser] = useState();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setUser(user);
      firebase.analytics().setUserId(user.uid);
    } else {
      setUser(null);
    }
  });
  return (
    <>
      {user === undefined ? (
        <div>loading</div>
      ) : (
        <Router>
          {user === null ? (
            <Redirect to="/login" />
          ) : (
            <div>
              <nav className="nav">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>

                  <li>
                    <Link to="" onClick={() => auth().signOut()}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/home/add-new-item">
              <AddNewItem />
            </Route>
            <Route path="/home/purchase">
              <Purchase />
            </Route>
            <Route path="/home/sales">
              <Sales />
            </Route>
            <Route path="/home/stock-summary">
              <StockSummary />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;
