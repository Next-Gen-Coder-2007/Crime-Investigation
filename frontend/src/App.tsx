import { ThemeProvider } from "./context/ThemeContext";
import useLenis from "./hooks/useLenis";
import Home from "./pages/Home";

function App() {
  useLenis();
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

export default App;
