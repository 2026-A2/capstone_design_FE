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

// [4] 전체 면접 리포트 목록 조회
export const getIndividualReports = async () => {
  if (USE_MOCK) {
    return individualReports;
  }

  const response = await axiosInstance.get('/interviews/');
  return response.data;
};

// 개별 리포트 요약 조회
// Swagger에 summary 전용 API가 없으므로 상세 리포트 API를 사용
export const getIndividualReportSummary = async (id) => {
  if (USE_MOCK) {
    return individualReports.find((report) => report.id === Number(id));
  }

  const response = await axiosInstance.get(`/interviews/${id}/report/`);
  return response.data;
};

// [3] 방금 마친 면접 결과 상세 리포트 조회
export const getIndividualReportDetail = async (id) => {
  if (USE_MOCK) {
    return individualReportsDetail.find((report) => report.id === Number(id));
  }

  const response = await axiosInstance.get(`/interviews/${id}/report/`);
  return response.data;
};

// [5] 회차별 변화 트렌드 데이터 조회
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

  const response = await axiosInstance.get('/interviews/trends/');
  return response.data;
};
