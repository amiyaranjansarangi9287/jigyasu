import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps {
  onComplete: () => void;
}

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState([0.5, 0.5, 0.5]);
  const [weights] = useState([
    [0.5, 0.3, -0.2, 0.4],
    [0.2, -0.4, 0.6, 0.1],
    [-0.3, 0.5, 0.2, -0.5],
  ]);
  const [hasExperimented, setHasExperimented] = useState(false);

  // Simple activation function (sigmoid-like for visualization)
  const activate = (x: number) => Math.max(0, Math.min(1, (x + 1) / 2));

  // Calculate hidden layer values
  const calculateHidden = useCallback(() => {
    return [0, 1, 2, 3].map(h => {
      const sum = inputs.reduce((acc, input, i) => acc + input * weights[i][h], 0);
      return activate(sum);
    });
  }, [inputs, weights]);

  // Calculate output
  const calculateOutput = useCallback(() => {
    const hidden = calculateHidden();
    const outputWeights = [0.6, -0.3, 0.4, 0.5];
    const sum = hidden.reduce((acc, h, i) => acc + h * outputWeights[i], 0);
    return activate(sum);
  }, [calculateHidden]);

  const hidden = calculateHidden();
  const output = calculateOutput();

  const handleInputChange = (index: number, value: number) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setHasExperimented(true);
  };

  const getColor = (value: number) => {
    const intensity = Math.round(value * 255);
    return `rgb(${intensity}, ${Math.round(intensity * 0.5)}, ${255 - intensity})`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🧸 Build Your Own Neural Network!</h2>
          <p className="text-green-100 mt-1">{t('auto.learning.s909_drag_the_sliders_and_watch_how_the_netwo', 'Drag the sliders and watch how the network responds!')}</p>
        </div>

        <div className="p-6">
          {/* Interactive Network */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Input Controls */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-bold text-blue-800 mb-4 text-center">📥 Inputs</h3>
              <p className="text-sm text-blue-600 mb-4 text-center">
                Move the sliders to change the input values!
              </p>
              {inputs.map((value, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between text-sm text-blue-700 mb-1">
                    <span>Input {i + 1}</span>
                    <span className="font-mono">{value.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={value}
                    onChange={(e) => handleInputChange(i, parseFloat(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value * 100}%, #dbeafe ${value * 100}%, #dbeafe 100%)`
                    }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mt-2 border-2 border-blue-300 transition-all"
                    style={{ backgroundColor: getColor(value) }}
                  />
                </div>
              ))}
            </div>

            {/* Hidden Layer Visualization */}
            <div className="bg-purple-50 rounded-2xl p-4">
              <h3 className="font-bold text-purple-800 mb-4 text-center">🔮 Hidden Layer</h3>
              <p className="text-sm text-purple-600 mb-4 text-center">
                Watch neurons activate based on inputs!
              </p>
              <div className="grid grid-cols-2 gap-4">
                {hidden.map((value, i) => (
                  <div key={i} className="text-center">
                    <div 
                      className={cn(
                        "w-16 h-16 rounded-full mx-auto border-4 transition-all duration-300 flex items-center justify-center",
                        value > 0.5 ? "border-purple-400 animate-pulse" : "border-purple-200"
                      )}
                      style={{ backgroundColor: getColor(value) }}
                    >
                      <span className="text-white font-bold text-sm drop-shadow">
                        {(value * 100).toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-xs text-purple-600 mt-1 block">
                      Neuron {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Output */}
            <div className="bg-green-50 rounded-2xl p-4">
              <h3 className="font-bold text-green-800 mb-4 text-center">📤 Output</h3>
              <p className="text-sm text-green-600 mb-4 text-center">
                The final answer from the network!
              </p>
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-24 h-24 rounded-full border-4 transition-all duration-300 flex items-center justify-center",
                    output > 0.5 ? "border-green-400 animate-bounce" : "border-green-200"
                  )}
                  style={{ backgroundColor: getColor(output) }}
                >
                  <span className="text-white font-bold text-xl drop-shadow">
                    {(output * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <span className={cn(
                    "text-lg font-bold",
                    output > 0.7 ? "text-green-600" : output > 0.3 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {output > 0.7 ? "🎉 High!" : output > 0.3 ? "🤔 Medium" : "📉 Low"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6">
            <h4 className="font-bold text-yellow-800 mb-2">💡 Try These Experiments:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Set all inputs to maximum (1.0) - what happens?</li>
              <li>• Set all inputs to minimum (0.0) - how does the output change?</li>
              <li>• Try different combinations - can you make the output exactly 50%?</li>
            </ul>
          </div>

          {/* Progress */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {hasExperimented ? (
                <span className="text-green-600">✅ Great experimenting!</span>) : (<span>👆 Try moving the sliders above!</span>
              )}
            </div>
            
            <button
              onClick={onComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                hasExperimented 
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500"
              )}
            >Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
