import React from 'react';

export default function SilenceBarChart({
  title = '침묵 구간 횟수',
  data = [],
  yAxisLabel = '횟수',
  xAxisLabel = '날짜',
  maxValue = 10,
  warningValue = 3,
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

  const barWidth = (chartWidth / (data.length || 1)) * 0.5;

  const getX = (index) =>
    padding.left +
    (chartWidth / data.length) * index +
    chartWidth / data.length / 2 -
    barWidth / 2;

  const getY = (value) =>
    padding.top + ((maxValue - value) / maxValue) * chartHeight;

  return (
    <div>
      <div style={{ fontWeight: '700', marginBottom: '12px' }}>{title}</div>

      <svg width={width} height={height}>
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

        {/* 경고 기준선 */}
        <line
          x1={padding.left}
          y1={getY(warningValue)}
          x2={width - padding.right}
          y2={getY(warningValue)}
          stroke="red"
          strokeDasharray="4"
        />

        <text
          x={width - padding.right + 10}
          y={getY(warningValue) - 5}
          fontSize="12"
          fill="#dc2626"
          fontWeight="600"
        >
          경고 기준 ({warningValue}회)
        </text>

        {data.map((item, index) => {
          const barHeight = chartHeight - (getY(item.value) - padding.top);

          return (
            <g key={index}>
              <rect
                x={getX(index)}
                y={getY(item.value)}
                width={barWidth}
                height={barHeight}
                fill={item.value < warningValue ? '#22c55e' : '#ef4444'}
                rx={4}
              />

              <text
                x={getX(index) + barWidth / 2}
                y={getY(item.value) - 5}
                textAnchor="middle"
                fontSize="12"
              >
                {item.value}
              </text>

              <text
                x={getX(index) + barWidth / 2}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                fontSize="12"
              >
                {item.label}
              </text>
            </g>
          );
        })}

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
