import React from 'react';
import { Zap, Clock } from 'lucide-react';

interface VirtualControlsProps {
  onDash: () => void;
  onChrono: () => void;
  isChronoActive: boolean;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onDash,
  onChrono,
  isChronoActive,
}) => {
  return (
    <div className="virtual-controls-container">
      {/* Right Action buttons */}
      <div className="virtual-actions">
        <button
          className={`virtual-circle-btn chrono-btn ${isChronoActive ? 'active' : ''}`}
          onTouchStart={(e) => {
            e.preventDefault();
            onChrono();
          }}
          onClick={onChrono}
          title="Chrono Matrix"
        >
          <Clock size={24} />
          <span>TIME</span>
        </button>

        <button
          className="virtual-circle-btn dash-btn"
          onTouchStart={(e) => {
            e.preventDefault();
            onDash();
          }}
          onClick={onDash}
          title="Quantum Dash"
        >
          <Zap size={24} />
          <span>DASH</span>
        </button>
      </div>
    </div>
  );
};
