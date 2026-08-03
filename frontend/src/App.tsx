import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import useLenis from "./hooks/useLenis";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  useLenis();
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<Home/>} path="/"/>
          <Route element={<Login/>} path="/login"/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
