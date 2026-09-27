import { useState } from "react";
import { storage, KEYS } from "./utils/storage";

// tab utama
import BerandaScreen from "./screens/BerandaScreen";
import ProgresScreen from "./screens/ProgresScreen";
import QuestScreen from "./screens/QuestScreen";
import JournalScreen from "./screens/JournalScreen";
import ProfilScreen from "./screens/ProfilScreen";

// flow
import CheckinScreen from "./screens/CheckinScreen";
import InsightScreen from "./screens/InsightScreen";
import ActivityScreen from "./screens/ActivityScreen";
import UrgeSurfingScreen from "./screens/UrgeSurfingScreen";
import JournalWriteScreen from "./screens/JournalWriteScreen";
import JournalDetailScreen from "./screens/JournalDetailScreen";
import HistoryScreen from "./screens/HistoryScreen";

// onboarding + login
import LoginScreen from "./screens/LoginScreen";
import OnboardingWelcome from "./screens/OnboardingWelcome";
import OnboardingUsername from "./screens/OnboardingUsername";
import OnboardingConsent from "./screens/OnboardingConsent";

// sub-screen profil
import UbahUsernameScreen from "./screens/UbahUsernameScreen";
import AturPengingatScreen from "./screens/AturPengingatScreen";
import KonsultasiScreen from "./screens/KonsultasiScreen";
import KrisisScreen from "./screens/KrisisScreen";
import BackupScreen from "./screens/BackupScreen";

import BottomNav from "./components/BottomNav";
import SosButton from "./components/SosButton";

const TABS = ["beranda", "progres", "quest", "jurnal", "profil"];

export default function App() {
  // entry point ditentukan sekali di awal
  const [history, setHistory] = useState(() => {
    const user = storage.get(KEYS.user);
    if (user && user.onboarded) return [{ screen: "login", params: {} }];
    return [{ screen: "onboardingWelcome", params: {} }];
  });

  const current = history[history.length - 1];
  const navigate = (screen, params = {}) => setHistory((h) => [...h, { screen, params }]);
  const goBack = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const goTab = (screen) => setHistory([{ screen, params: {} }]);

  const props = { navigate, goBack, params: current.params };

  const screens = {
    login: <LoginScreen {...props} />,
    onboardingWelcome: <OnboardingWelcome {...props} />,
    onboardingUsername: <OnboardingUsername {...props} />,
    onboardingConsent: <OnboardingConsent {...props} />,

    beranda: <BerandaScreen {...props} />,
    progres: <ProgresScreen {...props} />,
    quest: <QuestScreen {...props} />,
    jurnal: <JournalScreen {...props} />,
    profil: <ProfilScreen {...props} />,

    checkin: <CheckinScreen {...props} />,
    insight: <InsightScreen {...props} />,
    activity: <ActivityScreen {...props} />,
    urgesurfing: <UrgeSurfingScreen {...props} />,
    jurnaltulis: <JournalWriteScreen {...props} />,
    jurnalDetail: <JournalDetailScreen {...props} />,

    ubahUsername: <UbahUsernameScreen {...props} />,
    aturPengingat: <AturPengingatScreen {...props} />,
    konsultasi: <KonsultasiScreen {...props} />,
    krisis: <KrisisScreen {...props} />,
    history: <HistoryScreen {...props} />,
    backup: <BackupScreen {...props} />,
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