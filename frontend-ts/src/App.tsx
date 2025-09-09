import { Route, Routes } from "react-router";
import AppBar from "./components/AppBar";
import HomeScreen from "./screens/homeScreen";
import AnalysisScreen from "./screens/analysisScreen";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useThemeManager } from "@/hooks/useThemeManager";

function App() {
  const currentTheme = useThemeManager();

  return (
    <ConfigProvider
      theme={
        currentTheme === "light"
          ? {
              token: {
                colorPrimary: "#0e0211",
                colorInfo: "#ff3300",
                colorLink: "#ff3300",
                colorError: "#ff0000",
                borderRadius: 8,
                wireframe: false,
              },
            }
          : {
              token: {
                colorPrimary: "#ff3300",
                colorInfo: "#ff3300",
                borderRadius: 8,
                wireframe: false,
                colorBgBase: "#0a0a0a",
              },
              algorithm: antdTheme.darkAlgorithm,
            }
      }
    >
      <div className="bg-[#f5f5f5] dark:text-white dark:bg-dark-bg min-h-screen transition-colors">
        <AppBar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/analysis" element={<AnalysisScreen />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
}

export default App;