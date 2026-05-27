import axiosInstance from './axiosInstance';
import { individualReports } from '../mockdata/report/individualMock';
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

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const REPORT_LIST_PATH = '/interviews/';
const REPORT_TRENDS_PATH = '/interviews/trends/';
const getReportDetailPath = (id) => `/interviews/${id}/report/`;

const INTERVIEW_TYPE_LABELS = {
  RESUME: '자소서 기반 면접',
  JOB: '직무 기반 면접',
  INDUSTRY: '산업 기반 면접',
};

const INTERVIEW_TYPE_FILTERS = {
  RESUME: 'resume',
  JOB: 'industry',
  INDUSTRY: 'industry',
};

const getResponseTrends = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.trends)) return responseData.trends;
  if (Array.isArray(responseData?.data?.trends)) return responseData.data.trends;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.results)) return responseData.results;
  if (Array.isArray(responseData?.interviews)) return responseData.interviews;

  return [];
};

const unwrapReportData = (responseData) =>
  responseData?.report ||
  responseData?.data?.report ||
  responseData?.data ||
  responseData?.result ||
  responseData?.interview ||
  responseData ||
  {};

const normalizeReport = (data, fallbackId) => {
  const reportData = unwrapReportData(data);
  const id = reportData.interview_id ?? reportData.id ?? fallbackId;
  const interviewType = reportData.interview_type ?? reportData.interviewType;
  const date = reportData.date ?? '';
  const title =
    reportData.title ||
    `${date ? `${date} ` : ''}${INTERVIEW_TYPE_LABELS[interviewType] || '면접'} 리포트`;

  return {
    ...reportData,
    id,
    session: id,
    title,
    type: reportData.type || INTERVIEW_TYPE_FILTERS[interviewType] || 'resume',
    interviewType,
    interviewTypeLabel: INTERVIEW_TYPE_LABELS[interviewType] || interviewType,
    date,
    detail: {
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
    },
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

export const getIndividualReports = async () => {
  if (USE_MOCK) {
    return filterDeletedSessions(individualReports);
  }

  const response = await axiosInstance.get(REPORT_LIST_PATH);
  return filterDeletedSessions(
    getResponseTrends(response.data).map((item, index) =>
      normalizeReport(item, index + 1),
    ),
  );
};

export const getReportTrends = async () => {
  if (USE_MOCK) {
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

  const toChartItem = (item, value, extra = {}) => ({
    id: item.interview_id ?? item.id,
    session: item.date,
    date: item.date,
    value,
    interviewType: item.interview_type,
    ...extra,
  });

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
  if (USE_MOCK) {
    return individualReportsDetail.find(
      (report) => String(report.id) === String(id),
    );
  }

  try {
    const response = await axiosInstance.get(getReportDetailPath(id));
    const detailReport = normalizeReport(response.data || {}, id);

    if (hasReportMetrics(detailReport)) {
      return detailReport;
    }

    const trendReport = await getTrendReportById(id);

    return trendReport
      ? normalizeReport({ ...trendReport, ...unwrapReportData(response.data) }, id)
      : detailReport;
  } catch (error) {
    const trendReport = await getTrendReportById(id);

    if (!trendReport) {
      throw error;
    }

    return trendReport;
  }
};
