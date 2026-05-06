import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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
  standardValue, // 단일 기준
  standardMin, // 범위 기준 (최소)
  standardMax, // 범위 기준 (최대)
}) {
  console.log('차트 props:', { data, xKey, dataKey });
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

          {/* 🔹 단일 기준선 */}
          {standardValue !== undefined && (
            <ReferenceLine
              y={standardValue}
              strokeDasharray="5 5"
              label={`기준 ${standardValue}`}
            />
          )}

          {/* 🔹 범위 기준 */}
          {standardMin !== undefined && standardMax !== undefined && (
            <>
              <ReferenceArea
                y1={standardMin}
                y2={standardMax}
                fill="#2563eb"
                fillOpacity={0.1}
              />
              <ReferenceLine y={standardMin} strokeDasharray="5 5" />
              <ReferenceLine y={standardMax} strokeDasharray="5 5" />
            </>
          )}

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
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
    boxSizing: 'border-box',
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
  },
};
