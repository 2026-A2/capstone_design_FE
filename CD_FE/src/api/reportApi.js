import axiosInstance from './axiosInstance';
import { individualReportsDetail } from '../mockdata/report/individualmockdetail';
import { filterDeletedSessions } from '../pages/report/utils/filterDeletedSessions';
import {
  blinkTrend,
  bodyShakeTrend,
  eyeContactTrend,
  fillerTrend,
  nodTrend,
  shoulderTiltTrend,
  silenceTrend,
  smileTrend,
  speechRateTrend,
  voiceVolumeTrend,
} from '../mockdata/report/trendMock';

const MOCK_STORAGE_KEY = 'USE_MOCK';
const FORCE_MOCK_DATA = false;
const getEnvUseMock = () => import.meta.env.VITE_USE_MOCK === 'true';

// 초기값: 환경 변수에서 읽거나 true 기본값
const initializeMockMode = () => {
  if (FORCE_MOCK_DATA) {
    localStorage.setItem(MOCK_STORAGE_KEY, 'true');
    return true;
  }

  if (
    import.meta.env.VITE_USE_MOCK === 'true' ||
    import.meta.env.VITE_USE_MOCK === 'false'
  ) {
    localStorage.setItem(MOCK_STORAGE_KEY, String(getEnvUseMock()));
    return getEnvUseMock();
  }

  const stored = localStorage.getItem(MOCK_STORAGE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  // 환경 변수에서 초기값 설정 (기본값: true)
  return false;
};

export const getUseMock = () => {
  if (FORCE_MOCK_DATA) {
    return true;
  }

  if (
    import.meta.env.VITE_USE_MOCK === 'true' ||
    import.meta.env.VITE_USE_MOCK === 'false'
  ) {
    return getEnvUseMock();
  }

  const stored = localStorage.getItem(MOCK_STORAGE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  return false;
};

export const setUseMock = (value) => {
  localStorage.setItem(MOCK_STORAGE_KEY, String(value));
  console.log(`[Mock Mode] ${value ? 'Mock 데이터 사용' : 'API 데이터 사용'}`);
};

// 초기화
initializeMockMode();

const REPORT_LIST_PATH = '/interviews/';
const REPORT_TRENDS_PATH = '/interviews/trends/';
const getReportDetailPath = (id) => `/interviews/${id}/report/`;
const getReportDeletePath = (id) => `/interviews/${id}/delete/`;
const INTERVIEW_TYPE_LABELS = {
  RESUME: '자소서 기반 면접',
  JOB: '직무 기반 면접',
  INDUSTRY: '산업 기반 면접',
};

const INTERVIEW_TYPE_FILTERS = {
  RESUME: 'resume',
  JOB: 'job',
  INDUSTRY: 'job',
};

const getResponseTrends = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.trends)) return responseData.trends;
  if (Array.isArray(responseData?.data?.trends))
    return responseData.data.trends;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.results)) return responseData.results;
  if (Array.isArray(responseData?.interviews)) return responseData.interviews;

  return [];
};

const getReportId = (item) => item?.interview_id ?? item?.id ?? item?.session;

const unwrapReportData = (responseData) =>
  responseData?.report ||
  responseData?.data?.report ||
  responseData?.data ||
  responseData?.result ||
  responseData?.interview ||
  responseData ||
  {};

const getCreatedAt = (data) =>
  data?.created_at ??
  data?.Created_at ??
  data?.Created_At ??
  data?.createdAt ??
  data?.report?.created_at ??
  data?.report?.Created_at ??
  data?.report?.Created_At ??
  data?.report?.createdAt ??
  data?.interview?.created_at ??
  data?.interview?.Created_at ??
  data?.interview?.Created_At ??
  data?.interview?.createdAt ??
  data?.data?.created_at ??
  data?.data?.Created_at ??
  data?.data?.Created_At ??
  data?.data?.createdAt;

const normalizeReport = (data, fallbackId) => {
  const reportData = unwrapReportData(data);
  const id = reportData.interview_id ?? reportData.id ?? fallbackId;
  const interviewType = reportData.interview_type ?? reportData.interviewType;
  const createdAt = getCreatedAt(data) ?? getCreatedAt(reportData) ?? '';
  const date = createdAt || reportData.date || '';
  const title =
    reportData.title ||
    `${date ? `${date} ` : ''}${INTERVIEW_TYPE_LABELS[interviewType] || '면접'} 리포트`;

  // API 응답 데이터 로깅 (디버깅용)
  if (getUseMock() === false) {
    console.log('[API 응답 데이터]', {
      id,
      rawData: reportData,
      gaze_front_ratio: reportData.gaze_front_ratio,
      avg_spm: reportData.avg_spm,
      avg_db: reportData.avg_db,
      detail: reportData.detail,
    });
  }

  const detailData = {
    eyeContactRate:
      reportData.gaze_front_ratio ?? reportData.detail?.eyeContactRate,
    speechRate: reportData.avg_spm ?? reportData.detail?.speechRate,
    voiceVolume: reportData.avg_db ?? reportData.detail?.voiceVolume,
    silenceCount:
      reportData.total_silence_count ?? reportData.detail?.silenceCount,
    fillerCount:
      reportData.total_filler_count ?? reportData.detail?.fillerCount,
    smileRate: reportData.smile_ratio ?? reportData.detail?.smileRate,
    blinkCount: reportData.blink_per_min ?? reportData.detail?.blinkCount,
    nodCount: reportData.nod_per_min ?? reportData.detail?.nodCount,
    shoulderTilt:
      reportData.shoulder_stability ?? reportData.detail?.shoulderTilt,
    bodyShake: reportData.body_sway_per_min ?? reportData.detail?.bodyShake,
  };

  return {
    ...reportData,
    id,
    session: id,
    created_at: date,
    title,
    type: reportData.type || INTERVIEW_TYPE_FILTERS[interviewType] || 'resume',
    interviewType,
    interviewTypeLabel: INTERVIEW_TYPE_LABELS[interviewType] || interviewType,
    date,
    transcript:
      reportData.analysis_result?.speech?.transcript ||
      reportData.speech?.transcript ||
      reportData.transcript ||
      reportData.transcripts ||
      reportData.detail?.transcript ||
      {},
    detail: detailData,
    categories: reportData.categories || [],
  };
};

const hasReportMetrics = (report) =>
  Object.values(report.detail || {}).some(
    (value) => value !== undefined && value !== null,
  );

const getTrendReportById = async (id) => {
  const trendsResponse = await axiosInstance.get(REPORT_TRENDS_PATH);
  const trendItem = getResponseTrends(trendsResponse.data).find(
    (item) => String(item.interview_id ?? item.id) === String(id),
  );

  return trendItem ? normalizeReport(trendItem, id) : null;
};

export const getIndividualReportsFromApi = async () => {
  if (FORCE_MOCK_DATA) {
    console.log('[Mock 모드] getIndividualReportsFromApi 호출도 Mock 데이터 반환');
    return filterDeletedSessions(individualReportsDetail);
  }

  console.log('[API 모드] API에서 리포트 목록 조회 중...');
  const [listResponse, trendsResponse] = await Promise.all([
    axiosInstance.get(REPORT_LIST_PATH),
    axiosInstance.get(REPORT_TRENDS_PATH),
  ]);

  console.log('[API 응답 - 목록 원본]', listResponse.data);
  console.log('[API 응답 - 추세 원본]', trendsResponse.data);

  const trendItems = getResponseTrends(trendsResponse.data);
  const trendMap = new Map(
    trendItems.map((item) => [String(getReportId(item)), item]),
  );

  const normalizedReports = getResponseTrends(listResponse.data).map(
    (item, index) => {
      const trendItem = trendMap.get(String(getReportId(item))) || {};

      return normalizeReport(
        {
          ...item,
          ...trendItem,
          title: item.title ?? trendItem.title,
          created_at: getCreatedAt(item) ?? getCreatedAt(trendItem),
          date: item.date ?? trendItem.date,
          interview_type: item.interview_type ?? trendItem.interview_type,
          detail: {
            ...item.detail,
            ...trendItem.detail,
          },
        },
        index + 1,
      );
    },
  );

  console.log('[정규화된 리포트]', normalizedReports);

  return filterDeletedSessions(normalizedReports);
};

export const getIndividualReports = async () => {
  if (getUseMock()) {
    console.log('[Mock 모드] Mock 데이터 로드');
    return filterDeletedSessions(individualReportsDetail);
  }

  return getIndividualReportsFromApi();
};

export const getReportTrends = async () => {
  if (getUseMock()) {
    return {
      speechRateTrend: filterDeletedSessions(speechRateTrend),
      voiceVolumeTrend: filterDeletedSessions(voiceVolumeTrend),
      silenceTrend: filterDeletedSessions(silenceTrend),
      fillerTrend: filterDeletedSessions(fillerTrend),
      smileTrend: filterDeletedSessions(smileTrend),
      eyeContactTrend: filterDeletedSessions(eyeContactTrend),
      blinkTrend: filterDeletedSessions(blinkTrend),
      nodTrend: filterDeletedSessions(nodTrend),
      shoulderTiltTrend: filterDeletedSessions(shoulderTiltTrend),
      bodyShakeTrend: filterDeletedSessions(bodyShakeTrend),
    };
  }

  const response = await axiosInstance.get(REPORT_TRENDS_PATH);
  const trends = getResponseTrends(response.data);

  const toChartItem = (item, value, extra = {}) => {
    const id = item.interview_id ?? item.id ?? item.session;

    return {
      id,
      session: id ? `${id}회차` : item.date,
      date: item.created_at ?? item.date,
      value,
      interviewType: item.interview_type,
      ...extra,
    };
  };

  return {
    eyeContactTrend: filterDeletedSessions(
      trends.map((item) =>
        toChartItem(item, item.gaze_front_ratio, {
          subValue: item.gaze_deviation_ratio,
        }),
      ),
    ),

    speechRateTrend: filterDeletedSessions(
      trends.map((item) =>
        toChartItem(item, item.avg_spm, {
          level: item.pace,
        }),
      ),
    ),

    voiceVolumeTrend: filterDeletedSessions(
      trends.map((item) =>
        toChartItem(item, item.avg_db, {
          level: item.volume_level,
        }),
      ),
    ),

    silenceTrend: filterDeletedSessions(
      trends.map((item) => toChartItem(item, item.total_silence_count)),
    ),

    fillerTrend: filterDeletedSessions(
      trends.map((item) => toChartItem(item, item.total_filler_count)),
    ),

    smileTrend: filterDeletedSessions(
      trends.map((item) => toChartItem(item, item.smile_ratio)),
    ),

    blinkTrend: filterDeletedSessions(
      trends.map((item) => toChartItem(item, item.blink_per_min)),
    ),

    nodTrend: filterDeletedSessions(
      trends.map((item) => toChartItem(item, item.nod_per_min)),
    ),

    shoulderTiltTrend: filterDeletedSessions(
      trends.map((item) => toChartItem(item, item.shoulder_stability)),
    ),

    bodyShakeTrend: filterDeletedSessions(
      trends.map((item) => toChartItem(item, item.body_sway_per_min)),
    ),
  };
};

export const getIndividualReportDetail = async (id) => {
  if (getUseMock()) {
    console.log('[Mock 모드] 상세 리포트 로드 - ID:', id);
    return individualReportsDetail.find(
      (report) => String(report.id) === String(id),
    );
  }

  try {
    console.log('[API 모드] 상세 리포트 조회 중 - ID:', id);
    const response = await axiosInstance.get(getReportDetailPath(id));

    console.log('[API 응답 - 상세 리포트 원본]', response.data);

    const detailReport = normalizeReport(response.data || {}, id);

    console.log('[정규화된 상세 리포트]', {
      id: detailReport.id,
      title: detailReport.title,
      detail: detailReport.detail,
      hasMetrics: hasReportMetrics(detailReport),
    });

    if (hasReportMetrics(detailReport)) {
      return detailReport;
    }

    console.log('[메트릭 없음] Trend 데이터로 보충 시도');
    const trendReport = await getTrendReportById(id);

    return trendReport
      ? normalizeReport(
          { ...trendReport, ...unwrapReportData(response.data) },
          id,
        )
      : detailReport;
  } catch (error) {
    console.error('[API 오류] 상세 리포트 조회 실패:', error);
    const trendReport = await getTrendReportById(id);

    if (!trendReport) {
      throw error;
    }

    return trendReport;
  }
};

export const deleteIndividualReport = async (id) => {
  if (getUseMock()) {
    const deletedReportIds = JSON.parse(
      localStorage.getItem('deletedReportIds') || '[]',
    );

    if (!deletedReportIds.includes(String(id))) {
      localStorage.setItem(
        'deletedReportIds',
        JSON.stringify([...deletedReportIds, String(id)]),
      );
    }

    return { success: true };
  }

  const response = await axiosInstance.delete(getReportDeletePath(id));
  return response.data;
};
