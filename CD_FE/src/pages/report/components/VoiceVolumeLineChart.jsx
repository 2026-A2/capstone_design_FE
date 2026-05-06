import React from 'react';

export default function VoiceVolumeLineChart({
  title = '음성 크기 (dB)',
  data = [],
  yAxisLabel = 'dB',
  xAxisLabel = '날짜',
  minValue = 0,
  maxValue = 100,
}) {
  const width = 660;
  const height = 280;

  const padding = {
    top: 35,
    right: 35,
    bottom: 55,
    left: 55,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (index) =>
    padding.left + (chartWidth / (data.length - 1 || 1)) * index;

  const getY = (value) =>
    padding.top + ((maxValue - value) / (maxValue - minValue)) * chartHeight;

  return (
    <div>
      <div style={{ fontWeight: '700', marginBottom: '12px' }}>{title}</div>

      <svg width={width} height={height}>
        {/* 축 */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#333"
        />

        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#333"
        />

        {/* 정상 범위 밴드 (50~70 dB) */}
        <rect
          x={padding.left}
          y={getY(70)}
          width={chartWidth}
          height={getY(50) - getY(70)}
          fill="#dbeafe"
        />
        {/* 세로축 기준값 */}
        <text
          x={padding.left - 10}
          y={getY(70) + 4}
          textAnchor="end"
          fontSize="12"
          fill="#111827"
        >
          70
        </text>

        <text
          x={padding.left - 10}
          y={getY(50) + 4}
          textAnchor="end"
          fontSize="12"
          fill="#111827"
        >
          50
        </text>
        <text
          x={width - padding.right + 10}
          y={getY(70)}
          fontSize="12"
          fill="#2563eb"
        >
          적정 범위 (50~70 dB)
        </text>

        {/* 선 */}
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          points={data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ')}
        />

        {/* 점 + 값 */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.value)} r="4" fill="#2563eb" />

            <text
              x={getX(i)}
              y={getY(d.value) - 8}
              textAnchor="middle"
              fontSize="12"
            >
              {d.value}
            </text>

            <text
              x={getX(i)}
              y={height - padding.bottom + 15}
              textAnchor="middle"
              fontSize="12"
            >
              {d.label}
            </text>
          </g>
        ))}

        {/* 축 라벨 */}
        <text
          x={15}
          y={height / 2}
          transform={`rotate(-90 15 ${height / 2})`}
          fontSize="12"
        >
          {yAxisLabel}
        </text>

        <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="12">
          {xAxisLabel}
        </text>
      </svg>
    </div>
  );
}
