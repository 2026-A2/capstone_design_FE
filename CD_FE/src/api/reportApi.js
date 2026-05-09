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

export const getIndividualReports = async () => {
  return individualReports;
};
export const getIndividualReportSummary = async (id) => {
  return individualReports.find((report) => report.id === Number(id));
};

export const getIndividualReportDetail = async (id) => {
  return individualReportsDetail.find((report) => report.id === Number(id));
};

export const getReportTrends = async () => {
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
};
