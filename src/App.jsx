import { useState } from "react";
import BerandaScreen from "./screens/BerandaScreen";
import CheckinScreen from "./screens/CheckinScreen";
import InsightScreen from "./screens/InsightScreen";
import ActivityScreen from "./screens/ActivityScreen";

export default function App() {
  const [history, setHistory] = useState([{ screen: "beranda", params: {} }]);
  const current = history[history.length - 1];

  const navigate = (screen, params = {}) =>
    setHistory((h) => [...h, { screen, params }]);
  const goBack = () =>
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  const props = { navigate, goBack, params: current.params };

  const screens = {
    beranda: <BerandaScreen {...props} />,
    checkin: <CheckinScreen {...props} />,
    insight: <InsightScreen {...props} />,
    activity: <ActivityScreen {...props} />,
  };

  return (
    <div className="mx-auto max-w-md min-h-screen bg-canvas">
      {screens[current.screen] || <div className="p-6">404: {current.screen}</div>}
    </div>
  );
}