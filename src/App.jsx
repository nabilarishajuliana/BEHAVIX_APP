import { useState } from "react";
import BerandaScreen from "./screens/BerandaScreen";
import CheckinScreen from "./screens/CheckinScreen";
import InsightScreen from "./screens/InsightScreen";
import ActivityScreen from "./screens/ActivityScreen";
import UrgeSurfingScreen from "./screens/UrgeSurfingScreen";
import ProgresScreen from "./screens/ProgresScreen";
import QuestScreen from "./screens/QuestScreen";
import JournalScreen from "./screens/JournalScreen";
import JournalWriteScreen from "./screens/JournalWriteScreen";
import ProfilScreen from "./screens/ProfilScreen";
import BottomNav from "./components/BottomNav";
import SosButton from "./components/SosButton";

const TABS = ["beranda", "progres", "quest", "jurnal", "profil"];

export default function App() {
  const [history, setHistory] = useState([{ screen: "beranda", params: {} }]);
  const current = history[history.length - 1];

  const navigate = (screen, params = {}) =>
    setHistory((h) => [...h, { screen, params }]);
  const goBack = () =>
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const goTab = (screen) => setHistory([{ screen, params: {} }]); // tab = reset

  const props = { navigate, goBack, params: current.params };

  const screens = {
    beranda: <BerandaScreen {...props} />,
    checkin: <CheckinScreen {...props} />,
    insight: <InsightScreen {...props} />,
    activity: <ActivityScreen {...props} />,
    urgesurfing: <UrgeSurfingScreen {...props} />,
    progres: <ProgresScreen {...props} />,
    quest: <QuestScreen {...props} />,
    jurnal: <JournalScreen {...props} />,
    jurnaltulis: <JournalWriteScreen {...props} />,
    profil: <ProfilScreen {...props} />,
  };

  const isTab = TABS.includes(current.screen);

  return (
    <div className="mx-auto max-w-md min-h-screen bg-canvas relative">
      {screens[current.screen] || <div className="p-6">404: {current.screen}</div>}
      {isTab && <SosButton navigate={navigate} />}
      {isTab && <BottomNav current={current.screen} goTab={goTab} />}
    </div>
  );
}