import { Route, Routes } from "react-router";
import AppBar from "./components/AppBar";
import HomeScreen from "./screens/homeScreen";
import AnalysisScreen from "./screens/analysisScreen";

function App() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <AppBar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/analysis" element={<AnalysisScreen />} />
        {/* Add more routes as needed */}
        {/* <Route path="about" element={<AboutScreen />} /> */}
        {/* Fallback route */}
        <Route path="*" element={<HomeScreen/>} />
      </Routes>
    </div>
  );
}

export default App;
