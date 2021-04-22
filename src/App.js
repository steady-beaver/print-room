import "./App.css";
import Header from "./Components/Header/Header";
import LandingPage from "./Components/LandingPage/LandingPage.js";
import Profile from "./Components/Authentication/Profile";
import Signup from "./Components/Authentication/Signup";
import Login from "./Components/Authentication/Login";
import Search from "./Components/Purchase/Search"
import Upload from "./Components/Upload/Upload"
import Shopping from "./Components/Purchase/Shopping"
import ForgotPassword from "./Components/Authentication/ForgotPassword"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./PrivateRoute"
import {ShoppingBagProvider} from './Contexts/ShoppingBagContext'
import SuccessfulOrder from './Components/PurchaseResponse/SuccessfulOrder'
import FailedOrder from './Components/PurchaseResponse/FailedOrder'
import Home from './Components/Home/Home'
import ErrorPage404 from './Components/ErrorPage404/ErrorPage404'

const App = () => {

  return (
    <div className="App " >
      <AuthProvider>
        <ShoppingBagProvider>
          <Router>
            <Header />

            <div className="content-in-grid-10x10">
              <Switch>
                <PrivateRoute path="/" exact component={Home} />
                <Route path="/landing-page" exact component={LandingPage} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/search" component={Search} />
                <PrivateRoute path="/upload" component={Upload} />
                <PrivateRoute path="/shopping" component={Shopping} />
                <PrivateRoute path="/failed-order" component={FailedOrder} />
                <PrivateRoute path="/successful-order" component={SuccessfulOrder} />
                <Route path="*" component={ErrorPage404} />
             </Switch>
            </div>
          </Router>
        </ShoppingBagProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
