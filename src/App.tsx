import { HashRouter, Routes, Route } from 'react-router-dom'
import { TitleBar } from './components/layout/TitleBar'
import { NavBar } from './components/layout/NavBar'
import { LimboView } from './pages/LimboView'
import { SettingsView } from './pages/SettingsView'

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col h-screen bg-cream overflow-hidden">
        <TitleBar />
        <NavBar />
        <Routes>
          <Route path="/" element={<LimboView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
