export const ANALYSIS_METRICS = [
  {
    key: 'eyeContactRate',
    title: '시선처리',
    shortLabel: '시선',
    category: '시선',
    unit: '%',
  },
  {
    key: 'speechRate',
    title: '발화속도',
    shortLabel: '발화',
    category: '발화',
    unit: 'SPM',
  },
  {
    key: 'voiceVolume',
    title: '음성크기',
    shortLabel: '음성',
    category: '발화',
    unit: 'dB',
  },
  {
    key: 'silenceCount',
    title: '침묵구간',
    shortLabel: '침묵',
    category: '발화',
    unit: '회',
  },
  {
    key: 'fillerCount',
    title: '필러어',
    shortLabel: '필러',
    category: '발화',
    unit: '회',
  },
  {
    key: 'smileRate',
    title: '미소율',
    shortLabel: '표정',
    category: '표정',
    unit: '%',
  },
  {
    key: 'blinkCount',
    title: '눈 깜빡임',
    shortLabel: '눈깜빡임',
    category: '습관',
    unit: '회/분',
  },
  {
    key: 'nodCount',
    title: '고개 끄떡임',
    shortLabel: '끄떡임',
    category: '습관',
    unit: '%',
  },
  {
    key: 'shoulderTilt',
    title: '어깨기울기',
    shortLabel: '어깨',
    category: '자세',
    unit: '%',
  },
  {
    key: 'bodyShake',
    title: '몸통흔들림',
    shortLabel: '흔들림',
    category: '자세',
    unit: '회',
  },
];

export const getItemStatus = (key, value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return 'neutral';
  }

  const numericValue = Number(value);

  switch (key) {
    case 'eyeContactRate':
      if (numericValue >= 85) return 'good';
      if (numericValue >= 65) return 'warning';
      return 'bad';
    case 'speechRate':
      if (numericValue >= 250 && numericValue <= 350) return 'good';
      if (
        (numericValue >= 200 && numericValue < 250) ||
        (numericValue > 350 && numericValue <= 450)
      )
        return 'warning';
      return 'bad';
    case 'silenceCount':
      if (numericValue <= 3) return 'good';
      if (numericValue <= 6) return 'warning';
      return 'bad';
    case 'fillerCount':
      if (numericValue <= 3) return 'good';
      if (numericValue <= 6) return 'warning';
      return 'bad';
    case 'voiceVolume':
      if (numericValue >= -10) return 'bad';
      if (numericValue >= -20) return 'warning';
      if (numericValue >= -35) return 'good';
      if (numericValue >= -50) return 'warning';
      return 'bad';
    case 'smileRate':
      if (numericValue >= 11) return 'good';
      if (numericValue >= 5 && numericValue <= 10) return 'warning';
      return 'bad';
    case 'blinkCount':
      if (numericValue >= 40 && numericValue <= 60) return 'good';
      if (numericValue > 60 && numericValue <= 75) return 'warning';
      return 'bad';
    case 'nodCount':
      if (numericValue <= 1) return 'good';
      if (numericValue <= 5) return 'warning';
      return 'bad';
    case 'shoulderTilt':
      if (numericValue >= 90) return 'good';
      if (numericValue >= 75 && numericValue < 90) return 'warning';
      return 'bad';
    case 'bodyShake':
      if (numericValue <= 1) return 'good';
      if (numericValue >= 2 && numericValue <= 3) return 'warning';
      return 'bad';
    default:
      return 'neutral';
  }
};

export const getStatusTone = (status) => {
  switch (status) {
    case 'good':
      return 'good';
    case 'warning':
      return 'warning';
    case 'bad':
      return 'bad';
    default:
      return 'neutral';
  }
};

export const getStatusLabel = (status) => {
  switch (getStatusTone(status)) {
    case 'good':
      return '적정';
    case 'warning':
      return '주의';
    case 'bad':
      return '체크 필요';
    default:
      return '데이터 없음';
  }
};

export const getStatusColor = (status) => {
  switch (getStatusTone(status)) {
    case 'good':
      return '#22c55e';
    case 'warning':
      return '#facc15';
    case 'bad':
      return '#ef4444';
    default:
      return '#94a3b8';
  }
};
