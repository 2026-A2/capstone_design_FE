import React from 'react';

export default function FillerBarChart({
  title = '필러어 사용 횟수',
  data = [],
  yAxisLabel = '횟수',
  xAxisLabel = '날짜',
  maxValue = 10,
  warningValue = 6, // 6회 이상 경고
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

  const getX = (index) => {
    return (
      padding.left +
      (chartWidth / data.length) * index +
      chartWidth / data.length / 2 -
      barWidth / 2
    );
  };

  const getY = (value) => {
    return padding.top + ((maxValue - value) / maxValue) * chartHeight;
  };

  return (
    <div>
      <div style={{ fontWeight: '700', marginBottom: '12px' }}>{title}</div>

      <svg width={width} height={height}>
        {/* Y축 */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#333"
        />

        {/* X축 */}
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
        <line
          x1={padding.left}
          y1={getY(3)}
          x2={width - padding.right}
          y2={getY(3)}
          stroke="green"
          strokeDasharray="4"
        />
        <text
          x={width - padding.right + 10}
          y={getY(3) - 5}
          fontSize="12"
          textAnchor="start"
          fill="#16a34a"
          fontWeight="600"
        >
          우수 기준 (3회)
        </text>

        <text
          x={width - padding.right + 10}
          y={getY(6) - 5}
          fontSize="12"
          textAnchor="start"
          fill="#dc2626"
          fontWeight="600"
        >
          경고 기준 (6회)
        </text>
        {/* 막대 */}
        {data.map((item, index) => {
          const barHeight = chartHeight - (getY(item.value) - padding.top);

          return (
            <g key={index}>
              <rect
                x={getX(index)}
                y={getY(item.value)}
                width={barWidth}
                height={barHeight}
                fill={
                  item.value <= 3
                    ? '#22c55e' // 초록 (우수)
                    : item.value <= 6
                      ? '#eab308' // 노랑 (주의)
                      : '#ef4444' // 빨강 (경고)
                }
                rx={4}
              />

              {/* 값 표시 */}
              <text
                x={getX(index) + barWidth / 2}
                y={getY(item.value) - 5}
                textAnchor="middle"
                fontSize="12"
              >
                {item.value}
              </text>

              {/* 날짜 */}
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

        {/* Y축 라벨 */}
        <text
          x={15}
          y={height / 2}
          transform={`rotate(-90 15 ${height / 2})`}
          fontSize="12"
        >
          {yAxisLabel}
        </text>

        {/* X축 라벨 */}
        <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="12">
          {xAxisLabel}
        </text>
      </svg>
    </div>
  );
}
