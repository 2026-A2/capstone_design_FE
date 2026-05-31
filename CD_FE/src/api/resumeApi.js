import axiosInstance from './axiosInstance';

const unwrapResume = (data) =>
  data?.resume || data?.data?.resume || data?.data || data;

const unwrapResumeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.resumes)) return data.resumes;
  if (Array.isArray(data?.data?.resumes)) return data.data.resumes;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;

  return [];
};

export const normalizeResume = (resume) => {
  const data = unwrapResume(resume) || {};

  return {
    ...data,
    id: data.id ?? data.resume_id,
    title: data.title ?? '',
    content: data.content ?? '',
    createdAt: data.createdAt ?? data.created_at ?? data.created,
    updatedAt: data.updatedAt ?? data.updated_at ?? data.modified,
  };
};

export const getResume = async (resumeId) => {
  const response = await axiosInstance.get(`/resumes/${resumeId}/`);

  return normalizeResume(response.data);
};

export const getResumes = async () => {
  const response = await axiosInstance.get('/resumes/');
  const resumes = unwrapResumeList(response.data).map(normalizeResume);

  const detailedResults = await Promise.allSettled(
    resumes.map((resume) => getResume(resume.id)),
  );

  return resumes.map((resume, index) => {
    const result = detailedResults[index];

    if (result.status !== 'fulfilled') {
      return resume;
    }

    return {
      ...resume,
      ...result.value,
    };
  });
};

export const createResume = async ({ title, content }) => {
  const response = await axiosInstance.post('/resumes/create/', {
    title,
    content,
  });

  if (!response.data || typeof response.data !== 'object') {
    throw new Error('Invalid resume create response');
  }

  return normalizeResume(response.data);
};

export const updateResume = async ({ resumeId, title, content }) => {
  const response = await axiosInstance.put(`/resumes/${resumeId}/update/`, {
    title,
    content,
  });

  return normalizeResume(response.data);
};

export const deleteResume = async (resumeId) => {
  await axiosInstance.delete(`/resumes/${resumeId}/delete/`);
};
