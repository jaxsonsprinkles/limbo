import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Problem } from './components/Problem'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { Download } from './components/Download'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-cream font-sans">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Download />
      </main>
      <Footer />
    </div>
  )
}
