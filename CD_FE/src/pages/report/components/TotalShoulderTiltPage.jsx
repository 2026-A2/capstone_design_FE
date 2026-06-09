import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getIndividualReports, getReportTrends } from '../../../api/reportApi';

const LATEST_REPORT_LIMIT = 5;

const getComparableDate = (item) => {
  if (!item?.date) {
    return 0;
  }

  const timestamp = new Date(item.date).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getComparableSession = (item) => {
  const rawSession = item?.id ?? item?.session ?? 0;
  const sessionNumber = Number(String(rawSession).match(/\d+/)?.[0] ?? 0);

  return Number.isNaN(sessionNumber) ? 0 : sessionNumber;
};

const getSessionLabel = (item) => {
  if (item?.session === undefined || item?.session === null) {
    return item?.date || '-';
  }

  const sessionText = String(item.session);

  return sessionText.includes('회차') ? sessionText : `${sessionText}회차`;
};

const getLatestReports = (items) =>
  [...items]
    .filter((item) => item?.value !== undefined && item?.value !== null)
    .sort((a, b) => {
      const dateDiff = getComparableDate(b) - getComparableDate(a);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return getComparableSession(b) - getComparableSession(a);
    })
    .slice(0, LATEST_REPORT_LIMIT)
    .sort((a, b) => {
      const dateDiff = getComparableDate(a) - getComparableDate(b);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return getComparableSession(a) - getComparableSession(b);
    });

export default function TotalShoulderTiltPage() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [reportTotalCount, setReportTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trends, reports] = await Promise.all([
          getReportTrends(),
          getIndividualReports(),
        ]);

        console.log('어깨 기울기 추세 응답:', trends);

        setData(trends.shoulderTiltTrend || []);
        setReportTotalCount(Array.isArray(reports) ? reports.length : 0);
      } catch (error) {
        console.error('어깨 기울기 추세 조회 실패:', error);
        setData([]);
        setReportTotalCount(0);
      }
    };

    fetchData();
  }, []);

  const currentStep = 9;
  const totalStep = 10;
  const progressPercent = (currentStep / totalStep) * 100;

  const latestData = useMemo(() => getLatestReports(data), [data]);
  const shoulderDataCount = data.filter(
    (item) => item?.value !== undefined && item?.value !== null,
  ).length;
  const displayTotalCount = reportTotalCount || shoulderDataCount;

  return (
    <div style={styles.page}>
      <div style={styles.topHeader}>
        <div>
          <div style={styles.pageTitle}>
            누적 리포트 보기 · 전체 분석 · 어깨 기울기
          </div>

          <div style={styles.stepText}>
            {currentStep} / {totalStep} 단계
          </div>
        </div>

        <button
          style={styles.backToListButton}
          onClick={() => navigate('/report/total')}
        >
          ← 전체 분석 목록으로
        </button>
      </div>

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progressPercent}%`,
          }}
        />
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>어깨 기울기</div>
            <div style={styles.subTitle}>자세 · 올바른 자세 유지율</div>
          </div>
        </div>

        <div style={styles.recentSummary}>
          어깨 기울기 데이터 최신 {latestData.length}개
          {displayTotalCount > 0
            ? ` · 전체 리포트 ${displayTotalCount}개 중 최신순 기준`
            : ''}
        </div>

        <div style={styles.chartBox}>
          {latestData.length > 0 && <div style={styles.line} />}

          {latestData.length === 0 && (
            <div style={styles.emptyState}>
              표시할 어깨 기울기 리포트가 없습니다.
            </div>
          )}

          {latestData.map((item, index) => {
            const status = getStatus(item.value);

            return (
              <div key={`${item.session}-${index}`} style={styles.item}>
                <div
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: status.bg,
                    color: status.color,
                  }}
                >
                  {status.label}
                </div>

                <div
                  style={{
                    ...styles.circle,
                    borderColor: status.color,
                    color: status.color,
                  }}
                >
                  <strong>{Number(item.value).toFixed(1)}%</strong>
                  <span>유지</span>
                </div>

                <div style={styles.session}>{getSessionLabel(item)}</div>

                {index === 0 && (
                  <div style={styles.note}>권장 자세 유지율 90% 이상</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={styles.legend}>
          <span>
            <b style={{ backgroundColor: '#22c55e' }} /> ≥ 90% 안정
          </span>

          <span>
            <b style={{ backgroundColor: '#f59e0b' }} /> 75~89% 보통
          </span>

          <span>
            <b style={{ backgroundColor: '#ef4444' }} /> &lt; 75% 이탈
          </span>
        </div>

        <div style={styles.info}>
          어깨 라인이 평행 상태를 유지한 시간 비율입니다. 도넛형 그래프의 비율이
          높을수록 안정적인 자세를 유지한 것으로 볼 수 있습니다.
        </div>

        <div style={styles.buttonWrap}>
          <button
            style={styles.prevButton}
            onClick={() => navigate('/report/total/nod')}
          >
            이전
          </button>

          <button
            style={styles.nextButton}
            onClick={() => navigate('/report/total/body-shake')}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatus(value) {
  if (value >= 90) {
    return {
      label: '안정',
      color: '#22c55e',
      bg: '#dcfce7',
    };
  }

  if (value >= 75) {
    return {
      label: '보통',
      color: '#f59e0b',
      bg: '#fef3c7',
    };
  }

  return {
    label: '이탈',
    color: '#ef4444',
    bg: '#fee2e2',
  };
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f7fd',
    padding: '48px 40px 80px',
    boxSizing: 'border-box',
  },

  topHeader: {
    width: '760px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: '0 auto 14px',
  },

  pageTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '8px',
  },

  stepText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#6366f1',
  },

  backToListButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0,
    marginTop: '2px',
  },

  progressBar: {
    width: '760px',
    height: '10px',
    backgroundColor: '#e5e7eb',
    borderRadius: '999px',
    margin: '0 auto 28px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },

  card: {
    width: '860px',
    backgroundColor: '#fff',
    borderRadius: '18px',
    padding: '24px',
    margin: '0 auto',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px',
  },

  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#111827',
  },

  subTitle: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px',
  },

  recentSummary: {
    marginBottom: '12px',
    fontSize: '13px',
    fontWeight: '800',
    color: '#475569',
  },

  chartBox: {
    position: 'relative',
    height: '300px',
    backgroundColor: '#f8fafc',
    borderRadius: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '48px',
    flexWrap: 'wrap',
    padding: '26px 28px',
    boxSizing: 'border-box',
    overflowX: 'auto',
    overflowY: 'hidden',
  },

  emptyState: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#64748b',
  },

  line: {
    position: 'absolute',
    top: '128px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70%',
    maxWidth: '560px',
    height: '2px',
    backgroundColor: '#dbe3ef',
  },

  item: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  statusBadge: {
    padding: '4px 16px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '800',
    marginBottom: '8px',
  },

  circle: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    border: '10px solid',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },

  session: {
    marginTop: '48px',
    fontSize: '14px',
    fontWeight: '800',
    color: '#111827',
  },

  note: {
    marginTop: '12px',
    fontSize: '12px',
    color: '#f59e0b',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },

  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '14px',
    fontSize: '12px',
    color: '#64748b',
  },

  info: {
    marginTop: '22px',
    fontSize: '14px',
    color: '#475569',
    lineHeight: 1.6,
  },

  buttonWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  },

  prevButton: {
    border: 'none',
    backgroundColor: '#6b7280',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
  },

  nextButton: {
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
  },
};
