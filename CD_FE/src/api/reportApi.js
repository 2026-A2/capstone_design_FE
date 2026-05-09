import axiosInstance from './axiosInstance';

import { individualReports } from '../mockdata/report/individualMock';
import { individualReportsDetail } from '../mockdata/report/individualmockdetail';

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
    return individualReports;
  }

  const response = await axiosInstance.get('/reports');
  return response.data;
};

export const getIndividualReportSummary = async (id) => {
  if (USE_MOCK) {
    return individualReports.find((report) => report.id === Number(id));
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
    };
  }

  const response = await axiosInstance.get('/reports/trends');
  return response.data;
};
