import axiosInstance from './axiosInstance';

import { individualReports } from '../mockdata/report/individualMock';
import { individualReportsDetail } from '../mockdata/report/individualmockdetail';
import { filterDeletedSessions } from '../pages/report/utils/filterDeletedSessions';

import {
  speechRateTrend,
  voiceVolumeTrend,
  silenceTrend,
  fillerTrend,
  smileTrend,
  eyeContactTrend,
  blinkTrend,
  endingBlurTrend,
  nodTrend,
  shoulderTiltTrend,
  bodyShakeTrend,
} from '../mockdata/report/trendMock';

const USE_MOCK = true;

// [3.3] 내 면접 기록 목록 조회
export const getIndividualReports = async () => {
  if (USE_MOCK) {
    return individualReports;
  }

  const response = await axiosInstance.get('/interview/list/');
  return response.data;
};

// 개별 리포트 요약 조회
// 현재 Swagger에는 summary 전용 엔드포인트가 따로 안 보이므로
// 우선 개별 리포트 상세 API를 호출해서 사용
export const getIndividualReportSummary = async (id) => {
  if (USE_MOCK) {
    return individualReports.find((report) => report.id === Number(id));
  }

  const response = await axiosInstance.get(
    `/behavior/report/individual/${id}/`,
  );
  return response.data;
};

// [3.1] 개별 리포트 상세 조회
export const getIndividualReportDetail = async (id) => {
  if (USE_MOCK) {
    return individualReportsDetail.find((report) => report.id === Number(id));
  }

  const response = await axiosInstance.get(
    `/behavior/report/individual/${id}/`,
  );
  return response.data;
};

// [3.2] 누적 점수 추이 조회
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
      endingBlurTrend: filterDeletedSessions(endingBlurTrend),
      nodTrend: filterDeletedSessions(nodTrend),
      shoulderTiltTrend: filterDeletedSessions(shoulderTiltTrend),
      bodyShakeTrend: filterDeletedSessions(bodyShakeTrend),
    };
  }

  const response = await axiosInstance.get('/behavior/report/cumulative/');
  return response.data;
};
