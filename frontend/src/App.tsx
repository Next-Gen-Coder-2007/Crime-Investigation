import useLenis from "./hooks/useLenis";
import Home from "./pages/Home";

function App() {
  useLenis();
  return (
    <Home />
  )
}

export default App;