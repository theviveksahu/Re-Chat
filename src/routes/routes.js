import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import  LoginForm from '../components/login';
import ChatBoard from '../components/chat-board';
 
const AppRouter = () => {
  return (
    <Router>
      <div>
        <Route path="/" exact component={LoginForm}/>
        <Route path="/login" exact component={LoginForm} />
        <Route path="/chat-board" component={ChatBoard}/>
      </div>
    </Router>
  );
};

export default AppRouter;