import axios from 'axios';

const INTERVIEW_API_BASE_URL =
  import.meta.env.VITE_INTERVIEW_API_BASE_URL || 'http://localhost:8000';
const INTERVIEW_UPLOAD_PATH =
  import.meta.env.VITE_INTERVIEW_UPLOAD_PATH || '/interviews/';
const INTERVIEW_SESSION_PATH =
  import.meta.env.VITE_INTERVIEW_SESSION_PATH || '/interviews/';

const interviewApi = axios.create({
  baseURL: INTERVIEW_API_BASE_URL,
  timeout: 180000,
});

const getAnalyzeUrl = ({ interviewId }) =>
  `${INTERVIEW_UPLOAD_PATH}${interviewId}/questions/`;

const getFinalizeUrl = (interviewId) =>
  `${INTERVIEW_SESSION_PATH}${interviewId}/report/`;

const logUploadSuccess = ({ interviewId, order, url, questionText, response }) => {
  console.info('[interview upload:success]', {
    interviewId,
    order,
    url,
    status: response.status,
    questionText,
    data: response.data,
  });
};

const logUploadFailure = ({ interviewId, order, url, questionText, error }) => {
  console.error('[interview upload:failure]', {
    interviewId,
    order,
    url,
    questionText,
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
  });
};

const logSessionSuccess = ({ url, payload, response }) => {
  console.info('[interview session:success]', {
    url,
    status: response.status,
    payload,
    data: response.data,
  });
};

const logSessionFailure = ({ url, payload, error }) => {
  console.error('[interview session:failure]', {
    url,
    payload,
    status: error.response?.status,
    data: error.response?.data,
    headers: error.response?.headers,
    message: error.message,
  });
};

const logFinalizeSuccess = ({ interviewId, url, response }) => {
  console.info('[interview report:success]', {
    interviewId,
    url,
    status: response.status,
    data: response.data,
  });
};

const logFinalizeFailure = ({ interviewId, url, error }) => {
  console.error('[interview report:failure]', {
    interviewId,
    url,
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
  });
};

const getApiInterviewType = (questionType) =>
  questionType === 'resume' ? 'RESUME' : 'JOB';

const normalizeQuestionCount = (count) => {
  const value = Number(count);

  if (!Number.isInteger(value)) {
    return 4;
  }

  return Math.min(Math.max(value, 1), 4);
};

export const createInterviewSession = async ({
  questionType,
  questionCount,
  resumeText,
  industry,
  calibrationRecording,
}) => {
  const formData = new FormData();
  const interviewType = getApiInterviewType(questionType);
  const normalizedQuestionCount = normalizeQuestionCount(questionCount);

  formData.append('interview_type', interviewType);
  formData.append('question_count', String(normalizedQuestionCount));

  if (interviewType === 'RESUME') {
    formData.append('resume_text', resumeText || '');
  } else {
    formData.append('job_category', industry || '');
  }

  if (calibrationRecording) {
    formData.append(
      'video_file',
      calibrationRecording,
      calibrationRecording.name || 'calibration.webm',
    );
  }

  try {
    const response = await interviewApi.post(INTERVIEW_SESSION_PATH, formData);

    logSessionSuccess({
      url: INTERVIEW_SESSION_PATH,
      payload: {
        interview_type: interviewType,
        question_count: normalizedQuestionCount,
        resume_text: interviewType === 'RESUME' ? resumeText : undefined,
        job_category: interviewType === 'JOB' ? industry : undefined,
        video_file: calibrationRecording?.name,
      },
      response,
    });

    return {
      ...response.data,
      id: response.data?.id || response.data?.interview_id,
    };
  } catch (error) {
    logSessionFailure({
      url: INTERVIEW_SESSION_PATH,
      payload: {
        interview_type: interviewType,
        question_count: normalizedQuestionCount,
        resume_text: interviewType === 'RESUME' ? resumeText : undefined,
        job_category: interviewType === 'JOB' ? industry : undefined,
        video_file: calibrationRecording?.name,
      },
      error,
    });

    throw error;
  }
};

export const buildInterviewVideoFormData = ({
  recording,
  order,
  questionText,
}) => {
  const formData = new FormData();
  const filename = recording?.name || 'interview.webm';

  formData.append('video_file', recording, filename);
  formData.append('question_order', String(order));
  formData.append('question_text', questionText || '');

  return formData;
};

export const uploadInterviewVideo = async ({
  recording,
  interviewId,
  order,
  questionText,
}) => {
  const formData = buildInterviewVideoFormData({ recording, order, questionText });
  const url = getAnalyzeUrl({ interviewId, order });

  try {
    const response = await interviewApi.post(url, formData);

    logUploadSuccess({ interviewId, order, url, questionText, response });

    return response.data;
  } catch (error) {
    logUploadFailure({ interviewId, order, url, questionText, error });

    throw error;
  }
};

export const uploadInterviewQuestionRecording = async ({
  recording,
  interviewId,
  order,
  questionText,
}) => {
  return uploadInterviewVideo({
    recording,
    interviewId,
    order,
    questionText,
  });
};

export const getInterviewFinalReport = async (interviewId) => {
  const url = getFinalizeUrl(interviewId);

  try {
    const response = await interviewApi.get(url);

    logFinalizeSuccess({ interviewId, url, response });

    return response.data;
  } catch (error) {
    logFinalizeFailure({ interviewId, url, error });

    throw error;
  }
};
