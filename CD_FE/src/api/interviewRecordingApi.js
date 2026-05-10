import axios from 'axios';

const INTERVIEW_API_BASE_URL =
  import.meta.env.VITE_INTERVIEW_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000';
const INTERVIEW_UPLOAD_PATH =
  import.meta.env.VITE_INTERVIEW_UPLOAD_PATH || '/api/interviews/';
const DEFAULT_STATUS = 'recorded';

const interviewApi = axios.create({
  baseURL: INTERVIEW_API_BASE_URL,
  timeout: 180000,
});

const getInterviewTitle = ({ questionType, jobGroup, createdAt }) => {
  const typeLabel = questionType === 'resume' ? '자소서 기반' : '산업 기반';
  const targetLabel = jobGroup ? ` - ${jobGroup}` : '';
  const dateLabel = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(createdAt);

  return `${typeLabel} 면접${targetLabel} (${dateLabel})`;
};

export const createInterviewMetadata = ({
  questionType,
  resumeText,
  industry,
  recording,
  title,
  status = DEFAULT_STATUS,
  createdAt = new Date(),
}) => {
  const interviewType = questionType || 'unknown';
  const jobGroup = interviewType === 'industry' ? industry : '';
  const videoPath = recording?.name || '';

  return {
    title:
      title ||
      getInterviewTitle({
        questionType: interviewType,
        jobGroup,
        createdAt,
      }),
    interview_type: interviewType,
    cover_letter: interviewType === 'resume' ? resumeText || '' : '',
    job_group: jobGroup,
    video_path: videoPath,
    status,
    created_at: createdAt.toISOString(),
  };
};

export const buildInterviewVideoFormData = ({
  recording,
  metadata,
}) => {
  const formData = new FormData();
  const filename = recording?.name || metadata.video_path || 'interview.webm';

  formData.append('video', recording, filename);

  Object.entries(metadata).forEach(([key, value]) => {
    formData.append(key, value ?? '');
  });

  formData.append('metadata', JSON.stringify(metadata));

  return formData;
};

export const buildInterviewUploadRequests = ({
  questionRecordings,
  questionType,
  resumeText,
  industry,
}) => {
  return questionRecordings
    .map((recording, index) => {
      if (!recording) {
        return null;
      }

      const metadata = createInterviewMetadata({
        questionType,
        resumeText,
        industry,
        recording,
        title: `면접 ${index + 1}번 질문 녹화`,
      });

      return {
        metadata,
        formData: buildInterviewVideoFormData({
          recording,
          metadata,
        }),
      };
    })
    .filter(Boolean);
};

export const uploadInterviewVideo = async ({ recording, metadata }) => {
  const formData = buildInterviewVideoFormData({ recording, metadata });
  const response = await interviewApi.post(INTERVIEW_UPLOAD_PATH, formData);

  return response.data;
};

export const uploadInterviewVideos = async (payload) => {
  const uploadRequests = buildInterviewUploadRequests(payload);

  return Promise.all(
    uploadRequests.map(({ formData }) =>
      interviewApi
        .post(INTERVIEW_UPLOAD_PATH, formData)
        .then((response) => response.data),
    ),
  );
};
