import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import CoinPage from "./Pages/CoinPage";
import Homepage from "./Pages/Homepage";
import { makeStyles } from "@material-ui/core/styles";

const App = () => {
  const useStyles = makeStyles({
    App : {
      backgroundColor : '#14161a',
      color : "white",
      minHeight : "100vh",
    } 
  });
  const classes = useStyles();
  return (
    <BrowserRouter>
    <div className={classes.App}>
    <Routes>
      <Route path="/" element={<Header/>}>
      <Route index element={<Homepage/>}/>
      <Route path="coins/:id" element={<CoinPage/>}/>
      </Route>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
