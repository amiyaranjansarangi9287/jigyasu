// src/worlds/lab/modules/ElectricityWonderFirst.tsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout';
import { ROUTES } from '@/constants/routes';
import WonderFirstTemplate, { WonderFirstModule } from '@/core/modules/WonderFirstTemplate';
import { useConnectionOptimization } from '../../../../hooks/useConnectionOptimization';

// Exploration Component
function ExplorationComponent() {
  const [switchOn, setSwitchOn] = useState(true);
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(6);
  const { language } = useLearnerStore();

  const handleVoltageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVoltage(val);
    LearningService.trackEvent('electricity-wonder-session', 'lab', language, 'canvas_interaction', 'electricity', { voltage: val, resistance, switchOn });
  }, [language, resistance, switchOn]);

  const handleResistanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setResistance(val);
    LearningService.trackEvent('electricity-wonder-session', 'lab', language, 'canvas_interaction', 'electricity', { voltage, resistance: val, switchOn });
  }, [language, voltage, switchOn]);

  const toggleSwitch = useCallback(() => setSwitchOn(prev => !prev), []);

  const current = switchOn ? (voltage / resistance) : 0;

  return (
    <div className="space-y-6">
      {/* Switch toggle */}
      <button
        onClick={toggleSwitch}
        className={`w-full px-8 py-3 rounded-xl font-bold text-lg transition ${
          switchOn
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {switchOn ? '🔌 ON' : '🔌 OFF'}
      </button>

      {/* Voltage and Resistance controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400"><Trans i18nKey="auto.electricitywonderfirst.voltage">🔋 Voltage</Trans></span>
            <span className="text-sm font-medium text-yellow-600">{voltage}<Trans i18nKey="auto.electricitywonderfirst.v">V</Trans></span>
          </div>
          <input
            type="range"
            min="1"
            max="24"
            value={voltage}
            onChange={handleVoltageChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{ background: 'linear-gradient(to right, #F59E0B, #EF4444)' }}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400"><Trans i18nKey="auto.electricitywonderfirst.resistance">🔧 Resistance</Trans></span>
            <span className="text-sm font-medium text-orange-600">{resistance}Ω</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={resistance}
            onChange={handleResistanceChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{ background: 'linear-gradient(to right, #22C55E, #F97316)' }}
          />
        </div>
      </div>

      {/* Ohm's Law display */}
      <div className="bg-slate-800/50 rounded-2xl p-5 text-center border border-slate-700">
        <div className="text-sm text-yellow-400 font-mono font-bold">
          <Trans i18nKey="auto.electricitywonderfirst.i_v_r">I = V/R =</Trans> {voltage}/{resistance} = {current.toFixed(2)}<Trans i18nKey="auto.electricitywonderfirst.a">A</Trans>
                          </div>
        <div className="text-sm text-slate-300 mt-2">
          <Trans i18nKey="auto.electricitywonderfirst.more_voltage_more_current_more">More voltage = more current • More resistance = less current</Trans>
                          </div>
      </div>

      {/* Circuit visualization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="text-8xl mb-4">⚡</div>
          <div className="text-2xl font-bold text-slate-800 mb-2">
            {switchOn ? 'Current Flowing' : 'Circuit Open'}
          </div>
          <div className="text-sm text-slate-500">
            {switchOn ? `Current: ${current.toFixed(2)} Amperes` : 'No current flowing'}
          </div>
        </div>
      </div>

      {/* Observation prompts */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <Trans i18nKey="auto.electricitywonderfirst.what_do_you_notice">What do you notice?</Trans>
                          </h3>
        <ul className="text-slate-700 text-sm space-y-2">
          <li><Trans i18nKey="auto.electricitywonderfirst.what_happens_when_you_increase">• What happens when you increase voltage?</Trans></li>
          <li><Trans i18nKey="auto.electricitywonderfirst.what_happens_when_you_increase">• What happens when you increase resistance?</Trans></li>
          <li><Trans i18nKey="auto.electricitywonderfirst.why_does_the_switch_stop_the_c">• Why does the switch stop the current?</Trans></li>
          <li><Trans i18nKey="auto.electricitywonderfirst.how_does_ohm_s_law_explain_the">• How does Ohm's Law explain the relationship?</Trans></li>
        </ul>
      </div>
    </div>
  );
}

export default function ElectricityWonderFirst() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const connectionOptimization = useConnectionOptimization();

  // Wonder-First module configuration
  const electricityWonderModule: WonderFirstModule = {
    id: 'electricity-wonder',
    mystery: {
      question: "What is electricity really? Is it a fluid, particles, or something else entirely? And why does increasing voltage increase current while increasing resistance decreases it?",
      visual: "⚡",
      hook: "We use electricity every day, but have you ever wondered what it actually is? And why does voltage, current, and resistance follow such a simple mathematical relationship?",
    },
    exploration: {
      instructions: "Explore how voltage and resistance affect current in a circuit. What patterns do you notice? How does Ohm's Law explain the relationship?",
      hints: [
        "Increase the voltage. What happens to current?",
        "Increase the resistance. What happens to current?",
        "Toggle the switch. Why does current stop?",
        "Think about the formula I = V/R.",
      ],
      component: ExplorationComponent,
    },
    insight: {
      revelation: "Electricity is the flow of electrons through a conductor! Voltage (V) is the electrical pressure that pushes electrons, current (I) is the flow rate of electrons, and resistance (R) is how much the material opposes the flow. Ohm's Law (I = V/R) describes this relationship: current equals voltage divided by resistance. More voltage means more push, so more current flows. More resistance means more opposition, so less current flows. A switch breaks the circuit, creating infinite resistance and stopping all current. This simple relationship powers everything from light bulbs to computers!",
      connection: "The mystery of what electricity is and how it works is solved: it's electron flow! The key insight is that electricity follows Ohm's Law - a simple mathematical relationship between voltage, current, and resistance. Voltage pushes electrons through a conductor, but resistance opposes the flow. The balance between push and opposition determines how much current flows. This is why increasing voltage increases current (more push), while increasing resistance decreases current (more opposition). A switch breaks the circuit, creating infinite resistance and stopping all flow. This simple principle powers our entire modern world!",
      ahaMoment: "Electricity is electron flow, and Ohm's Law (I = V/R) describes how voltage pushes and resistance opposes this flow!",
    },
    application: {
      realWorld: "We use electricity everywhere - lighting, heating, communication, transportation, and computing. Understanding Ohm's Law helps us design circuits, troubleshoot electrical problems, and even understand how our bodies use electrical signals in nerves and muscles.",
      indianContext: "India was one of the first countries to adopt electricity on a massive scale. Jagadish Chandra Bose (1895) pioneered radio waves before Marconi! Today, India's power grid is the world's largest synchronized grid, serving 1.4 billion people. Indian engineers have made significant contributions to electrical engineering, from power generation to electronics. The concept of 'Vidyut' (electricity) appears in ancient texts, showing early understanding of electrical phenomena. Traditional Indian knowledge included understanding of static electricity (from amber) and bioelectricity in the body.\n\n🎨 **Holi Connection**: In modern times, Holi celebrations often include electric lighting and sound systems. The festival's vibrant energy mirrors the energy of electricity that powers modern celebrations. The use of electric lights for nighttime Holi celebrations shows how electricity has become integral to festival traditions.\n\n🌾 **Pongal Connection**: While traditionally an agricultural festival, modern Pongal celebrations use electricity for cooking, lighting, and entertainment. The festival honors the sun (natural energy source) while celebrating the technological progress that brings electricity to rural areas. Electric pumps for irrigation and electric lights for celebrations show how electricity supports agricultural life.\n\n👨‍🔬 **Jagadish Chandra Bose (1858-1937)** - Pioneered radio waves and microwave optics, demonstrating India's leadership in electrical research.\n\n👨‍🔬 **Satyendra Nath Bose (1894-1974)** - Made fundamental contributions to quantum statistics, understanding electrical properties of particles.\n\n👨‍🔬 **Homi J. Bhabha (1909-1966)** - Father of India's nuclear program, worked on electrical and atomic energy applications.\n\n👨‍🔬 **A.P.J. Abdul Kalam (1931-2015)** - Scientist and President who worked on electrical systems for missiles and space applications.\n\n👩‍🔬 **Anna Mani (1918-2001)** - Pioneering physicist who studied atmospheric electricity and solar radiation. Her work on weather instruments advanced Indian meteorology and our understanding of atmospheric electrical phenomena.",
      tryIt: "Next time you flip a light switch, remember: you're completing a circuit that allows electrons to flow. The voltage in your walls pushes electrons through the filament, and the resistance of the filament limits the flow, creating light. And the entire process follows the simple relationship I = V/R - Ohm's Law, discovered in 1827 but still powering our world today!",
    },
  };

  return (
    <div className="min-h-screen">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />
      <WonderFirstTemplate module={electricityWonderModule} onComplete={() => navigate(ROUTES.FAMILY_HOME)} />
    </div>
  );
}
