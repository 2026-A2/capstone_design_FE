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

const USE_MOCK = false;

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

const normalizeReport = (data, fallbackId) => {
  const id = data.interview_id ?? data.id ?? fallbackId;
  const interviewType = data.interview_type ?? data.interviewType;
  const date = data.date ?? '';
  const title =
    data.title ||
    `${date ? `${date} ` : ''}${INTERVIEW_TYPE_LABELS[interviewType] || '면접'} 리포트`;

  return {
    ...data,
    id,
    session: id,
    title,
    type: data.type || INTERVIEW_TYPE_FILTERS[interviewType] || 'resume',
    interviewType,
    interviewTypeLabel: INTERVIEW_TYPE_LABELS[interviewType] || interviewType,
    date,
    detail: {
      eyeContactRate: data.gaze_front_ratio ?? data.detail?.eyeContactRate,
      speechRate: data.avg_spm ?? data.detail?.speechRate,
      voiceVolume: data.avg_db ?? data.detail?.voiceVolume,
      silenceCount: data.total_silence_count ?? data.detail?.silenceCount,
      fillerCount: data.total_filler_count ?? data.detail?.fillerCount,
      smileRate: data.smile_ratio ?? data.detail?.smileRate,
      blinkCount: data.blink_per_min ?? data.detail?.blinkCount,
      nodCount: data.nod_per_min ?? data.detail?.nodCount,
      shoulderTilt: data.shoulder_stability ?? data.detail?.shoulderTilt,
      bodyShake: data.body_sway_per_min ?? data.detail?.bodyShake,
    },
    categories: data.categories || [],
  };
};

export const getIndividualReports = async () => {
  if (USE_MOCK) {
    return filterDeletedSessions(individualReports);
  }

  const response = await axiosInstance.get('/reports/trends');
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

  const response = await axiosInstance.get('/reports/trends');
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
    const response = await axiosInstance.get(`/reports/${id}`);
    return normalizeReport(response.data || {}, id);
  } catch (error) {
    const trendsResponse = await axiosInstance.get('/reports/trends');
    const trendItem = getResponseTrends(trendsResponse.data).find(
      (item) => String(item.interview_id ?? item.id) === String(id),
    );

    if (!trendItem) {
      throw error;
    }

    return normalizeReport(trendItem, id);
  }
};
