import axiosInstance from './axiosInstance';

const RECORDING_UPLOAD_PATH = '/interviews/recordings';

export const buildInterviewRecordingFormData = ({
  questions,
  questionRecordings,
  questionType,
  industry,
}) => {
  const formData = new FormData();
  const metadata = {
    questionType,
    industry,
    recordings: [],
  };

  questionRecordings.forEach((recording, index) => {
    if (!recording) {
      return;
    }

    const filename =
      recording.name || `interview-question-${index + 1}.webm`;

    formData.append('videos', recording, filename);
    metadata.recordings.push({
      questionIndex: index,
      question: questions[index] || '',
      filename,
      mimeType: recording.type || 'video/webm',
      size: recording.size,
    });
  });

  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
  );

  return formData;
};

export const uploadInterviewRecordings = async (payload) => {
  const formData = buildInterviewRecordingFormData(payload);
  const response = await axiosInstance.post(RECORDING_UPLOAD_PATH, formData);

  return response.data;
};
