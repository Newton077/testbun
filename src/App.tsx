import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WalletDashboard from "./components/ui/WalletDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WalletDashboard />} />
        {/* Puedes agregar más rutas aquí si es necesario */}
      </Routes>
    </Router>
  );
}

export default App;
