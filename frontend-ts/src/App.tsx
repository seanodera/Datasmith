import AppBar from "./components/AppBar";
import HomeScreen from "./screens/homeScreen";

function App() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <AppBar />
      <div>
        <HomeScreen />
      </div>
    </div>
  );
}

export default App;
