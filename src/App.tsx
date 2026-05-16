import { Header } from './components/Header';
import { CircuitBuilder } from './components/CircuitBuilder';
import { FlowHeatPanel } from './components/FlowHeatPanel';
import { ResultsPanel } from './components/ResultsPanel';

export function App() {
  return (
    <div class="app-layout">
      <Header />
      <main class="app-main">
        <div class="left-column">
          <FlowHeatPanel />
          <ResultsPanel />
        </div>
        <div class="right-column">
          <CircuitBuilder />
        </div>
      </main>
      <footer class="app-footer">
        Calculations per Idronics 12 (Caleffi) — Darcy-Weisbach with Churchill friction factor.
        For design reference only.
      </footer>
    </div>
  );
}
