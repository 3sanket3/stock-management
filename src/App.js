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
  apiKey: "AIzaSyCGmf9rwlQ0O_PmNtCSktLKt5_U7ARBcfk",
  authDomain: "stock-management-21fc2.firebaseapp.com",
  databaseURL: "https://stock-management-21fc2.firebaseio.com",
  projectId: "stock-management-21fc2",
  storageBucket: "stock-management-21fc2.appspot.com",
  messagingSenderId: "321740486636",
  appId: "1:321740486636:web:c69e0a8d72ae16e11232c9",
  measurementId: "G-XMNPM7HRN3",
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
