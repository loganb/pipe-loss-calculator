import { Header } from './components/Header';
import { CircuitBuilder } from './components/CircuitBuilder';
import { FlowHeatPanel } from './components/FlowHeatPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { PumpSelector } from './components/PumpSelector';
import { PumpChart } from './components/PumpChart';
import { OperatingPointCard } from './components/OperatingPointCard';

export function App() {
  return (
    <div class="app-layout">
      <Header />

      <sl-tab-group class="main-tabs">
        <sl-tab slot="nav" panel="circuit">
          <sl-icon slot="prefix" name="diagram-3" />
          Circuit
        </sl-tab>
        <sl-tab slot="nav" panel="pump">
          <sl-icon slot="prefix" name="activity" />
          Pump Curve
        </sl-tab>

        {/* ── Tab 1: Circuit ── */}
        <sl-tab-panel name="circuit">
          <main class="app-main">
            <div class="left-column">
              <FlowHeatPanel />
              <ResultsPanel />
            </div>
            <div class="right-column">
              <CircuitBuilder />
            </div>
          </main>
        </sl-tab-panel>

        {/* ── Tab 2: Pump Curve ── */}
        <sl-tab-panel name="pump">
          <div class="pump-main">
            <div class="pump-left">
              <PumpSelector />
              <OperatingPointCard />
            </div>
            <div class="pump-right">
              <PumpChart />
            </div>
          </div>
        </sl-tab-panel>
      </sl-tab-group>

      <footer class="app-footer">
        Calculations per Idronics 12 (Caleffi) — Darcy-Weisbach with Churchill friction factor.
        For design reference only.
      </footer>
    </div>
  );
}
