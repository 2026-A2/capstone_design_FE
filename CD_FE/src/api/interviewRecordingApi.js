import axios from 'axios';

const INTERVIEW_API_BASE_URL =
  import.meta.env.VITE_INTERVIEW_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000';
const INTERVIEW_UPLOAD_PATH =
  import.meta.env.VITE_INTERVIEW_UPLOAD_PATH || '/behavior/analyze/';
const INTERVIEW_SESSION_PATH =
  import.meta.env.VITE_INTERVIEW_SESSION_PATH || '/interview/';

const interviewApi = axios.create({
  baseURL: INTERVIEW_API_BASE_URL,
  timeout: 180000,
});

const getAnalyzeUrl = ({ interviewId, order }) =>
  `${INTERVIEW_UPLOAD_PATH}${interviewId}/${order}/`;

const getFinalizeUrl = (interviewId) =>
  `${INTERVIEW_SESSION_PATH}${interviewId}/finalize/`;

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

export const createInterviewSession = async ({
  questionType,
  questions,
}) => {
  const payload = {
    interview_type: getApiInterviewType(questionType),
    questions: questions.map((question) =>
      typeof question === 'string' ? question : question.question_text,
    ),
  };

  try {
    const response = await interviewApi.post(INTERVIEW_SESSION_PATH, payload);

    logSessionSuccess({
      url: INTERVIEW_SESSION_PATH,
      payload,
      response,
    });

    return {
      ...response.data,
      id: response.data?.id || response.data?.interview_id,
    };
  } catch (error) {
    logSessionFailure({
      url: INTERVIEW_SESSION_PATH,
      payload,
      error,
    });

    throw error;
  }
};

export const buildInterviewVideoFormData = ({
  recording,
  questionText,
}) => {
  const formData = new FormData();
  const filename = recording?.name || 'interview.webm';

  formData.append('video_file', recording, filename);
  formData.append('question_text', questionText || '');

  return formData;
};

export const uploadInterviewVideo = async ({
  recording,
  interviewId,
  order,
  questionText,
}) => {
  const formData = buildInterviewVideoFormData({ recording, questionText });
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
