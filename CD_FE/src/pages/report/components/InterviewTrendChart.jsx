import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';

export default function InterviewTrendChart({
  data,
  dataKey,
  xKey = 'date',
  yLabel,
  minValue = 0,
  maxValue = 100,
  standardValue,
  standardMin,
  standardMax,
  overSpeedValue,
  highlightAboveValue,
  highlightAboveColor = '#e8ecfa',
  lines,
}) {
  const chartLines = lines || [
    {
      dataKey,
      stroke: '#2563eb',
      name: yLabel,
    },
  ];
  const standardAreaLabel = {
    value: '적정 기준 영역',
    position: 'insideTopRight',
    fill: '#334155',
    fontSize: 12,
    fontWeight: 700,
  };

  return (
    <div style={styles.chartBox}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 12, right: 20, left: 45, bottom: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={xKey}
            label={{
              value: '날짜',
              position: 'insideBottom',
              offset: -10,
            }}
          />

          <YAxis
            domain={[minValue, maxValue]}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <Tooltip />
          {lines && <Legend verticalAlign="top" align="right" height={28} />}

          {highlightAboveValue !== undefined && (
            <ReferenceArea
              y1={highlightAboveValue}
              y2={maxValue}
              fill={highlightAboveColor}
              fillOpacity={1}
              label={standardAreaLabel}
            />
          )}

          {standardValue !== undefined && (
            <ReferenceLine
              y={standardValue}
              strokeDasharray="5 5"
              label={`기준 ${standardValue}`}
            />
          )}

          {standardMin !== undefined && standardMax !== undefined && (
            <>
              <ReferenceArea
                y1={standardMin}
                y2={standardMax}
                fill="#2563eb"
                fillOpacity={0.1}
                label={standardAreaLabel}
              />
              <ReferenceLine
                y={standardMin}
                strokeDasharray="5 5"
                label={{
                  value: `기준 ${standardMin}`,
                  position: 'insideBottomLeft',
                  fill: '#4b5563',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
              <ReferenceLine
                y={standardMax}
                strokeDasharray="5 5"
                label={{
                  value: `기준 ${standardMax}`,
                  position: 'insideTopLeft',
                  fill: '#4b5563',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            </>
          )}

          {overSpeedValue !== undefined && (
            <ReferenceLine
              y={overSpeedValue}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `과속 기준 ${overSpeedValue} SPM`,
                position: 'insideTopLeft',
                fill: '#ef4444',
                fontSize: 12,
                fontWeight: 700,
              }}
            />
          )}

          {chartLines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.stroke}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  chartBox: {
    width: '760px',
    height: '360px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    margin: '0 auto',
    boxSizing: 'border-box',
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
  },
};
