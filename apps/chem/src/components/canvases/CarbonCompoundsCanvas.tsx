import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface Hydrocarbon {
  name: string; formula: string; carbons: number; hydrogens: number;
  state: 'gas' | 'liquid' | 'solid'; use: string; boilingPoint: number;
  indianContext?: string;
}

const HYDROCARBONS: Hydrocarbon[] = [
  { name: 'Methane', formula: 'CH₄', carbons: 1, hydrogens: 4, state: 'gas', use: 'Natural gas, biogas', boilingPoint: -161, indianContext: 'Gobar gas plants in villages!' },
  { name: 'Ethane', formula: 'C₂H₆', carbons: 2, hydrogens: 6, state: 'gas', use: 'Fuel, refrigerant', boilingPoint: -89 },
  { name: 'Propane', formula: 'C₃H₈', carbons: 3, hydrogens: 8, state: 'gas', use: 'LPG cooking gas', boilingPoint: -42, indianContext: 'Ujjwala Yojana — clean LPG for all!' },
  { name: 'Butane', formula: 'C₄H₁₀', carbons: 4, hydrogens: 10, state: 'gas', use: 'Lighters, stoves', boilingPoint: -1 },
  { name: 'Pentane', formula: 'C₅H₁₂', carbons: 5, hydrogens: 12, state: 'liquid', use: 'Solvent', boilingPoint: 36 },
  { name: 'Hexane', formula: 'C₆H₁₄', carbons: 6, hydrogens: 14, state: 'liquid', use: 'Oil extraction', boilingPoint: 69 },
  { name: 'Octane', formula: 'C₈H₁₈', carbons: 8, hydrogens: 18, state: 'liquid', use: 'Petrol/Gasoline', boilingPoint: 126, indianContext: 'Indian Oil, BPCL, HPCL — fuel for India!' },
  { name: 'Decane', formula: 'C₁₀H₂₂', carbons: 10, hydrogens: 22, state: 'liquid', use: 'Kerosene', boilingPoint: 174 },
];

interface Allotrope { name: string; emoji: string; structure: string; hardness: string; conductivity: string; uses: string; indianContext?: string; }

const CARBON_ALLOTROPES: Allotrope[] = [
  { name: 'Diamond', emoji: '💎', structure: 'Tetrahedral 3D lattice', hardness: '10 (hardest!)', conductivity: 'None', uses: 'Jewelry, cutting tools', indianContext: 'Golconda mines — world\'s first diamond source!' },
  { name: 'Graphite', emoji: '✏️', structure: 'Flat sheets (layers)', hardness: '1-2 (very soft)', conductivity: 'Good (along layers)', uses: 'Pencils, lubricant, batteries', indianContext: 'Used in nuclear reactors at BARC' },
  { name: 'Fullerene (C₆₀)', emoji: '⚽', structure: 'Football-shaped cage', hardness: 'Moderate', conductivity: 'Semi-conductor', uses: 'Medicine delivery, solar cells' },
  { name: 'Graphene', emoji: '📄', structure: 'Single atom-thick sheet', hardness: 'Flexible but very strong', conductivity: 'Excellent', uses: 'Flexible screens, batteries, sensors', indianContext: 'IIT researchers lead graphene research!' },
];

type ViewMode = 'explore' | 'build' | 'allotropes' | 'functional';

export default function CarbonCompoundsCanvas(_props: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [selectedHC, setSelectedHC] = useState<Hydrocarbon>(HYDROCARBONS[0]);
  const [buildCarbons, setBuildCarbons] = useState(1);
  const [selectedAllotrope, setSelectedAllotrope] = useState<Allotrope | null>(null);

  const buildHydrogens = buildCarbons * 2 + 2;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-1.5 flex-wrap justify-center">
        {([['explore', '🔍 Explore'], ['build', '🔗 Build'], ['allotropes', '💎 Allotropes'], ['functional', '⚗️ Functional Groups']] as [ViewMode, string][]).map(([m, l]) => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold ${viewMode === m ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* EXPLORE */}
      {viewMode === 'explore' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">💎 Hydrocarbon Series</h3>

          <div className="flex flex-wrap gap-2 justify-center">
            {HYDROCARBONS.map(hc => (
              <button key={hc.name} onClick={() => setSelectedHC(hc)}
                className={`px-3 py-1.5 rounded-lg text-sm ${selectedHC.name === hc.name ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {hc.formula}
              </button>
            ))}
          </div>

          {/* Molecule visualization */}
          <div className="relative w-full max-w-md h-36 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center justify-center overflow-x-auto px-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: selectedHC.carbons }).map((_, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 }} className="flex flex-col items-center">
                  {/* Top H atoms */}
                  <div className="flex gap-0.5 mb-0.5">
                    <motion.div className="w-5 h-5 rounded-full bg-white text-gray-800 text-[9px] font-bold flex items-center justify-center shadow-sm"
                      animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>H</motion.div>
                    {(i === 0 || i === selectedHC.carbons - 1) && (
                      <motion.div className="w-5 h-5 rounded-full bg-white text-gray-800 text-[9px] font-bold flex items-center justify-center shadow-sm"
                        animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 0.5 }}>H</motion.div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {i > 0 && <div className="w-3 h-0.5 bg-emerald-500/70" />}
                    <motion.div className="w-8 h-8 rounded-full bg-gray-700 text-white text-xs font-bold flex items-center justify-center shadow-lg z-10"
                      whileHover={{ scale: 1.2, boxShadow: '0 0 12px rgba(16,185,129,0.5)' }}>C</motion.div>
                    {i < selectedHC.carbons - 1 && <div className="w-3 h-0.5 bg-emerald-500/70" />}
                  </div>
                  {/* Bottom H atoms */}
                  <div className="flex gap-0.5 mt-0.5">
                    <motion.div className="w-5 h-5 rounded-full bg-white text-gray-800 text-[9px] font-bold flex items-center justify-center shadow-sm"
                      animate={{ y: [0, 2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 1 }}>H</motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold ${
              selectedHC.state === 'gas' ? 'bg-blue-600' : 'bg-cyan-600'} text-white`}>
              {selectedHC.state === 'gas' ? '💨 Gas' : '💧 Liquid'}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm w-full border border-slate-700">
            <div className="flex justify-between mb-2">
              <div>
                <h4 className="font-bold text-white text-lg">{selectedHC.name}</h4>
                <p className="text-emerald-400 font-mono">{selectedHC.formula}</p>
              </div>
              <div className="text-right text-sm text-slate-400">
                <p>🌡️ BP: {selectedHC.boilingPoint}°C</p>
                <p>C: {selectedHC.carbons} H: {selectedHC.hydrogens}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">📦 Use: {selectedHC.use}</p>
            {selectedHC.indianContext && <p className="text-sm text-emerald-400">🇮🇳 {selectedHC.indianContext}</p>}
          </div>

          {/* Boiling point trend chart */}
          <div className="bg-slate-800/50 rounded-xl p-3 max-w-sm w-full border border-slate-700">
            <p className="text-xs text-slate-400 mb-2 text-center">Boiling Point Trend (more C → higher BP)</p>
            <div className="flex items-end gap-1 h-20">
              {HYDROCARBONS.map(hc => (
                <motion.div key={hc.name} className="flex-1 flex flex-col items-center"
                  initial={{ height: 0 }} animate={{ height: 'auto' }}>
                  <motion.div
                    className={`w-full rounded-t ${selectedHC.name === hc.name ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    initial={{ height: 0 }}
                    animate={{ height: Math.max(4, ((hc.boilingPoint + 170) / 350) * 60) }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="text-[8px] text-slate-500 mt-1">C{hc.carbons}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* BUILD */}
      {viewMode === 'build' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">🔗 Build a Hydrocarbon</h3>
          <p className="text-slate-400 text-sm">CₙH₂ₙ₊₂ — the alkane general formula</p>

          <div className="flex items-center justify-center gap-1 py-4 min-h-[80px] bg-slate-800/50 rounded-xl w-full max-w-md">
            {Array.from({ length: buildCarbons }).map((_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 }} className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-gray-700 text-white text-xs font-bold flex items-center justify-center shadow">C</div>
                {i < buildCarbons - 1 && <div className="w-3 h-0.5 bg-emerald-500" />}
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setBuildCarbons(Math.max(1, buildCarbons - 1))} className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-full text-white text-2xl font-bold">−</button>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{buildCarbons}</p>
              <p className="text-xs text-slate-400">Carbons</p>
            </div>
            <button onClick={() => setBuildCarbons(Math.min(10, buildCarbons + 1))} className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-full text-white text-2xl font-bold">+</button>
          </div>

          <motion.div key={buildCarbons} initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="bg-emerald-600/20 border border-emerald-500/30 rounded-xl p-4 text-center">
            <p className="text-xl font-mono text-emerald-400">C{buildCarbons > 1 ? buildCarbons : ''}H{buildHydrogens}</p>
            <p className="text-xs text-slate-400">Hydrogen count = 2×{buildCarbons} + 2 = {buildHydrogens}</p>
            {HYDROCARBONS.find(h => h.carbons === buildCarbons) && (
              <p className="text-sm text-white mt-2 font-bold">{HYDROCARBONS.find(h => h.carbons === buildCarbons)!.name}</p>
            )}
          </motion.div>
        </>
      )}

      {/* ALLOTROPES */}
      {viewMode === 'allotropes' && (
        <>
          <h3 className="text-xl font-bold text-purple-400">💎 Carbon Allotropes</h3>
          <p className="text-slate-400 text-sm">Same element, completely different properties!</p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {CARBON_ALLOTROPES.map((allo, i) => (
              <motion.button key={allo.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedAllotrope(selectedAllotrope?.name === allo.name ? null : allo)}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedAllotrope?.name === allo.name ? 'bg-purple-600/30 border-2 border-purple-500' : 'bg-slate-800/50 border border-slate-700'
                }`}>
                <div className="text-3xl mb-2">{allo.emoji}</div>
                <p className="font-bold text-white text-sm">{allo.name}</p>
                <p className="text-[10px] text-slate-400">{allo.structure}</p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selectedAllotrope && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-slate-800 rounded-xl p-4 max-w-sm w-full border border-purple-500/30">
                <h4 className="text-lg font-bold text-white mb-2">{selectedAllotrope.emoji} {selectedAllotrope.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-700/50 p-2 rounded"><span className="text-slate-400">Hardness:</span> <span className="text-white">{selectedAllotrope.hardness}</span></div>
                  <div className="bg-slate-700/50 p-2 rounded"><span className="text-slate-400">Conductivity:</span> <span className="text-white">{selectedAllotrope.conductivity}</span></div>
                </div>
                <p className="text-sm text-slate-300 mb-1">📦 Uses: {selectedAllotrope.uses}</p>
                {selectedAllotrope.indianContext && <p className="text-sm text-emerald-400">🇮🇳 {selectedAllotrope.indianContext}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* FUNCTIONAL GROUPS */}
      {viewMode === 'functional' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">⚗️ Functional Groups</h3>
          <p className="text-slate-400 text-sm">Carbon chains + special groups = new properties!</p>

          <div className="w-full max-w-md space-y-2">
            {[
              { name: 'Alcohol (-OH)', formula: 'R-OH', example: 'Ethanol (C₂H₅OH)', use: 'Sanitizers, fuel', emoji: '🍷', indianContext: 'Ethanol blended with petrol in India!' },
              { name: 'Carboxylic Acid (-COOH)', formula: 'R-COOH', example: 'Acetic Acid (CH₃COOH)', use: 'Vinegar, preservatives', emoji: '🫗', indianContext: 'Sirka — used in pickles!' },
              { name: 'Aldehyde (-CHO)', formula: 'R-CHO', example: 'Formaldehyde (HCHO)', use: 'Preserving specimens', emoji: '🧪' },
              { name: 'Ketone (C=O)', formula: 'R-CO-R', example: 'Acetone (CH₃COCH₃)', use: 'Nail polish remover', emoji: '💅' },
              { name: 'Ester (-COO-)', formula: 'R-COO-R', example: 'Ethyl acetate', use: 'Flavors, fragrances', emoji: '🌸', indianContext: 'Jasmine fragrance is an ester!' },
            ].map((fg, i) => (
              <motion.div key={fg.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex gap-3">
                <span className="text-2xl flex-shrink-0">{fg.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{fg.name}</h4>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-600/20 px-1.5 py-0.5 rounded">{fg.formula}</span>
                  </div>
                  <p className="text-xs text-slate-400">Example: {fg.example} • {fg.use}</p>
                  {fg.indianContext && <p className="text-xs text-emerald-400 mt-0.5">🇮🇳 {fg.indianContext}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Biogas Revolution:</span> Over 5 million biogas (CH₄) plants in India 
          convert cow dung into clean cooking fuel — carbon chemistry saving forests!
        </p>
      </motion.div>
    </div>
  );
}
