import React, { useState, useMemo } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

// --- DESIGN TOKENS ---
const COLORS = {
  wildSand: '#F2F2F2',
  white: '#FFFFFF',
  bunting: '#141F4C',    // Textos oscuros / Línea
  pictonBlue: '#29ABE2', // Barras Contestadas
  darkBlue: '#2000D6',   // Barras Total
  mariner: '#2376C9',    // Elementos secundarios
  marinerLight: 'rgba(35, 118, 201, 0.1)',
  grey: '#E0E0E0'
};

// --- MOCK DATA (La Historia del 9 de Enero vs Otros) ---
const DATASETS = {
  '09-01-2026': [
    { time: '08:00', total: 15, answered: 12, wait: 8 },  // Inicio
    { time: '10:00', total: 65, answered: 60, wait: 5 },  // Pico 1
    { time: '12:00', total: 55, answered: 50, wait: 4 },  // Continuación
    { time: '14:00', total: 20, answered: 18, wait: 2 },  // Hora de almuerzo (Caída)
    { time: '16:00', total: 45, answered: 42, wait: 3 },  // Pico 2
    { time: '18:00', total: 10, answered: 10, wait: 1 },  // Cierre
  ],
  '10-01-2026': [
    { time: '08:00', total: 10, answered: 9, wait: 2 },
    { time: '10:00', total: 30, answered: 28, wait: 3 }, // Menos actividad
    { time: '12:00', total: 35, answered: 34, wait: 2 },
    { time: '14:00', total: 25, answered: 24, wait: 1 },
    { time: '16:00', total: 20, answered: 20, wait: 1 },
    { time: '18:00', total: 5, answered: 5, wait: 0 },
  ]
};

const OPTIONS = [
  { id: '09-01-2026', label: '09 Ene 2026', desc: 'Día Laboral (Picos)' },
  { id: '10-01-2026', label: '10 Ene 2026', desc: 'Fin de Semana' },
];

export default function App() {
  // --- STATE ---
  const [selectedDateId, setSelectedDateId] = useState('09-01-2026');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState({
    total: true,
    answered: true,
    wait: true
  });

  const currentData = DATASETS[selectedDateId];
  const activeOption = OPTIONS.find(o => o.id === selectedDateId);

  // --- HANDLERS ---
  const toggleSeries = (seriesKey) => {
    setVisibleSeries(prev => ({ ...prev, [seriesKey]: !prev[seriesKey] }));
  };

  const handleDateSelect = (id) => {
    setSelectedDateId(id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F2F2F2] font-sans p-4 overflow-hidden">

      {/* --- MAIN FLOATING CARD (Elevation Low) --- */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_12px_rgba(20,31,76,0.08)] w-full max-w-4xl p-8 relative transition-all duration-500 hover:-translate-y-1">

        {/* HEADER: Title & Filter */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col gap-2">
            {/* Abstract Title */}
            <div className="w-32 h-5 rounded bg-[#141F4C]"></div>
            {/* Abstract Subtitle */}
            <div className="w-48 h-1 rounded bg-[#2376C9] opacity-40"></div>
          </div>

          {/* DATE PICKER COMPONENT */}
          <div className="relative z-20">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
                ${isDropdownOpen
                  ? 'bg-[#E6F4FA] border-[#29ABE2] text-[#2000D6]'
                  : 'bg-white border-gray-200 text-[#141F4C] hover:bg-gray-50'}
              `}
            >
              <span className="text-sm font-bold tracking-wide">{activeOption.label}</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU (Elevation High) */}
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-[0_12px_24px_rgba(20,31,76,0.15)] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleDateSelect(opt.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between group transition-colors
                      ${selectedDateId === opt.id ? 'bg-[#F2F2F2] text-[#2000D6]' : 'text-[#141F4C] hover:bg-gray-50'}
                    `}
                  >
                    <div>
                      <div className="font-bold">{opt.label}</div>
                      <div className="text-xs opacity-60 mt-0.5">{opt.desc}</div>
                    </div>
                    {selectedDateId === opt.id && <Check size={16} className="text-[#29ABE2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LEGEND / TOGGLES */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-100 pb-6">
          <LegendItem
            label="Total Llamadas"
            color={COLORS.darkBlue}
            active={visibleSeries.total}
            onClick={() => toggleSeries('total')}
            type="bar"
          />
          <LegendItem
            label="Contestadas"
            color={COLORS.pictonBlue}
            active={visibleSeries.answered}
            onClick={() => toggleSeries('answered')}
            type="bar"
          />
          <LegendItem
            label="Tiempo Espera (s)"
            color={COLORS.bunting}
            active={visibleSeries.wait}
            onClick={() => toggleSeries('wait')}
            type="line"
          />
          {/* Example of "Strikethrough" / Inactive item */}
          <LegendItem
            label="Salientes (N/A)"
            color="#999"
            active={false}
            disabled={true}
            type="bar"
          />
        </div>

        {/* CHART AREA */}
        <div className="h-64 w-full relative">
          <CustomComboChart data={currentData} visibleSeries={visibleSeries} colors={COLORS} />
        </div>

        {/* FOOTER ABSTRACT */}
        <div className="mt-8 flex items-center gap-4 opacity-30">
          <div className="w-full h-[1px] bg-[#141F4C]"></div>
          <div className="w-4 h-4 rounded-full border-2 border-[#141F4C]"></div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: LEGEND ITEM ---
const LegendItem = ({ label, color, active, onClick, disabled, type }) => (
  <button
    onClick={disabled ? undefined : onClick}
    className={`
      flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300
      ${disabled ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer hover:bg-gray-50'}
      ${!active && !disabled ? 'opacity-50 grayscale' : ''}
    `}
  >
    <div
      className={`w-3 h-3 ${type === 'line' ? 'rounded-full' : 'rounded-sm'}`}
      style={{ backgroundColor: color }}
    ></div>
    <span className={`text-xs font-bold ${active ? 'text-[#141F4C]' : 'text-gray-400'}`}>
      {label}
    </span>
  </button>
);

// --- SUB-COMPONENT: CUSTOM SVG CHART ---
const CustomComboChart = ({ data, visibleSeries, colors }) => {
  const height = 250;
  const width = 100; // Percent
  const maxVal = 70; // Fixed Y scale for demo stability
  const maxWait = 10; // Fixed Y scale for line

  // Helper to map values to Y coordinates
  const getY = (val) => height - (val / maxVal) * height;
  const getLineY = (val) => height - (val / maxWait) * height;

  // Generate Line Path
  const linePoints = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = getLineY(d.wait);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 250">

      {/* Grid Lines (Abstract) */}
      {[0, 25, 50, 75, 100].map((y, i) => (
        <line
          key={i}
          x1="0" y1={height - (y / 100) * height}
          x2="100" y2={height - (y / 100) * height}
          stroke={colors.wildSand}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* BARS GROUP */}
      <svg x="0" y="0" width="100%" height="100%">
        {data.map((d, i) => {
          const xPos = (i / (data.length - 1)) * 100;
          const barWidth = 6; // visual width unit relative to viewport

          return (
            <g key={i} className="transition-all duration-500 ease-out">

              {/* Bar: Total Calls (Dark Blue) */}
              {visibleSeries.total && (
                <rect
                  x={`${xPos - 4}%`} // Offset
                  y={getY(d.total)}
                  width="3%"
                  height={height - getY(d.total)}
                  fill={colors.darkBlue}
                  rx="4" // Rounded tops
                  className="transition-all duration-500"
                />
              )}

              {/* Bar: Answered Calls (Picton Blue) - Overlapping slightly for "grouped" effect */}
              {visibleSeries.answered && (
                <rect
                  x={`${xPos}%`}
                  y={getY(d.answered)}
                  width="3%"
                  height={height - getY(d.answered)}
                  fill={colors.pictonBlue}
                  rx="4"
                  className="transition-all duration-500"
                  style={{ opacity: 0.9 }}
                />
              )}

              {/* X Axis Label */}
              <text
                x={`${xPos}%`}
                y={height + 20}
                textAnchor="middle"
                fill={colors.bunting}
                fontSize="10"
                fontWeight="bold"
                style={{ opacity: 0.6 }}
              >
                {d.time}
              </text>
            </g>
          );
        })}
      </svg>

      {/* LINE CHART (Wait Time) - Rendered on top */}
      {visibleSeries.wait && (
        <>
          <polyline
            points={linePoints}
            fill="none"
            stroke={colors.bunting}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke" // Keeps line distinct
            className="drop-shadow-md transition-all duration-500"
          />
          {/* Dots on the line */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={`${(i / (data.length - 1)) * 100}%`}
              cy={getLineY(d.wait)}
              r="4"
              fill={colors.white}
              stroke={colors.bunting}
              strokeWidth="2"
              className="transition-all duration-500"
            />
          ))}
        </>
      )}

    </svg>
  );
};