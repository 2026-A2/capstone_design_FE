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

export const getIndividualReports = async () => {
  if (USE_MOCK) {
    // 개발 중에는 항상 최신 mock 데이터 사용 (localStorage 무시)
    return individualReports;
  }

  // 프로덕션: localStorage 확인 후 API 호출
  try {
    const savedReports = JSON.parse(localStorage.getItem('individualReports'));
    if (savedReports && Array.isArray(savedReports)) {
      return savedReports;
    }
  } catch (error) {
    console.error('localStorage 읽기 실패:', error);
  }

  const response = await axiosInstance.get('/reports');
  return response.data;
};

export const getIndividualReportSummary = async (id) => {
  if (USE_MOCK) {
    // 개발 중에는 항상 최신 mock 데이터 사용 (localStorage 무시)
    return individualReports.find((report) => report.id === Number(id));
  }

  // 프로덕션: localStorage 확인 후 API 호출
  try {
    const savedReports = JSON.parse(localStorage.getItem('individualReports'));
    if (savedReports && Array.isArray(savedReports)) {
      const savedReport = savedReports.find(
        (report) => report.id === Number(id),
      );
      if (savedReport) {
        return savedReport;
      }
    }
  } catch (error) {
    console.error('localStorage 읽기 실패:', error);
  }

  const response = await axiosInstance.get(`/reports/${id}/summary`);
  return response.data;
};

export const getIndividualReportDetail = async (id) => {
  if (USE_MOCK) {
    return individualReportsDetail.find((report) => report.id === Number(id));
  }

  const response = await axiosInstance.get(`/reports/${id}`);
  return response.data;
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
      endingBlurTrend: filterDeletedSessions(endingBlurTrend),
      nodTrend: filterDeletedSessions(nodTrend),
      shoulderTiltTrend: filterDeletedSessions(shoulderTiltTrend),
      bodyShakeTrend: filterDeletedSessions(bodyShakeTrend),
    };
  }

  const response = await axiosInstance.get('/reports/trends');
  return response.data;
};
