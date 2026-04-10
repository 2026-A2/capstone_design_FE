import React from 'react';

const InterviewTrendChart = ({
  title = '추이 그래프',
  data = [],
  xAxisLabel = '날짜',
  yAxisLabel = '값',
  minValue = 0,
  maxValue = 100,
  standardType = 'line', // 'line' | 'range'
  standardValue = 60,
  standardMin = 200,
  standardMax = 260,
  standardLabel = '적정',
}) => {
  const width = 700;
  const height = 400;

  const padding = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const safeData = Array.isArray(data) ? data : [];

  const getX = (index) => {
    if (safeData.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (chartWidth / (safeData.length - 1)) * index;
  };

  const getY = (value) => {
    const clampedValue = Math.max(minValue, Math.min(maxValue, value));
    return (
      padding.top +
      ((maxValue - clampedValue) / (maxValue - minValue)) * chartHeight
    );
  };

  const points = safeData.map((item, index) => ({
    x: getX(index),
    y: getY(item.value),
    label: item.label,
    value: item.value,
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const yTicks = [];
  const tickCount = 5;
  const step = (maxValue - minValue) / tickCount;
  for (let i = 0; i <= tickCount; i += 1) {
    yTicks.push(Math.round(minValue + step * i));
  }

  const standardY = getY(standardValue);
  const standardMinY = getY(standardMin);
  const standardMaxY = getY(standardMax);

  return (
    <div style={styles.card}>
      <div style={styles.chartTitle}>{title}</div>

      <svg width="100%" height="400" viewBox={`0 0 ${width} ${height}`}>
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="18"
          fill="#dbeafe"
        />

        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              <text
                x={padding.left - 14}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#334155"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#1d4ed8"
          strokeWidth="2.5"
        />

        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#1d4ed8"
          strokeWidth="2.5"
        />

        <polygon
          points={`${padding.left - 6},${padding.top + 8} ${padding.left + 6},${padding.top + 8} ${padding.left},${padding.top - 4}`}
          fill="#1d4ed8"
        />

        {standardType === 'line' && (
          <>
            <line
              x1={padding.left}
              y1={standardY}
              x2={width - padding.right}
              y2={standardY}
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <text
              x={width - padding.right - 4}
              y={standardY - 8}
              textAnchor="end"
              fontSize="12"
              fill="#475569"
              fontWeight="600"
            >
              {standardLabel} ({standardValue})
            </text>
          </>
        )}

        {standardType === 'range' && (
          <>
            <rect
              x={padding.left}
              y={standardMaxY}
              width={chartWidth}
              height={standardMinY - standardMaxY}
              fill="rgba(100, 116, 139, 0.15)"
            />
            <line
              x1={padding.left}
              y1={standardMaxY}
              x2={width - padding.right}
              y2={standardMaxY}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <line
              x1={padding.left}
              y1={standardMinY}
              x2={width - padding.right}
              y2={standardMinY}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <text
              x={width - padding.right - 4}
              y={standardMaxY - 8}
              textAnchor="end"
              fontSize="12"
              fill="#475569"
              fontWeight="600"
            >
              적정 상한 ({standardMax} spm)
            </text>
            <text
              x={width - padding.right - 4}
              y={standardMinY - 8}
              textAnchor="end"
              fontSize="12"
              fill="#475569"
              fontWeight="600"
            >
              적정 하한 ({standardMin} spm)
            </text>
          </>
        )}

        {points.length >= 2 && (
          <polyline
            fill="none"
            stroke="#4f67d9"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={polylinePoints}
          />
        )}

        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#4f67d9"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={point.y - 14}
              textAnchor="middle"
              fontSize="12"
              fill="#1e3a8a"
              fontWeight="700"
            >
              {point.value}
            </text>
            <text
              x={point.x}
              y={height - padding.bottom + 28}
              textAnchor="middle"
              fontSize="12"
              fill="#111827"
            >
              {point.label}
            </text>
          </g>
        ))}

        <text
          x={padding.left + chartWidth / 2}
          y={height - 18}
          textAnchor="middle"
          fontSize="14"
          fill="#0f172a"
          fontWeight="700"
        >
          {xAxisLabel}
        </text>

        <text
          x="28"
          y={padding.top + chartHeight / 2}
          textAnchor="middle"
          fontSize="14"
          fill="#0f172a"
          fontWeight="700"
          transform={`rotate(-90, 28, ${padding.top + chartHeight / 2})`}
        >
          {yAxisLabel}
        </text>
      </svg>
    </div>
  );
};

const styles = {
  card: {
    width: '760px',
    minHeight: '460px',
    backgroundColor: '#bfdbfe',
    borderRadius: '20px',
    padding: '24px',
    boxSizing: 'border-box',
    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.12)',
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '16px',
  },
};

export default InterviewTrendChart;
