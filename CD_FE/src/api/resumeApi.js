import axiosInstance from './axiosInstance';

const unwrapResume = (data) =>
  data?.resume || data?.data?.resume || data?.data || data;

const unwrapResumeList = (data) => {
  let list = [];

  if (Array.isArray(data)) list = data;
  else if (Array.isArray(data?.resumes)) list = data.resumes;
  else if (Array.isArray(data?.data?.resumes)) list = data.data.resumes;
  else if (Array.isArray(data?.data)) list = data.data;
  else if (Array.isArray(data?.results)) list = data.results;

  return list.flat();
};

export const normalizeResume = (resume) => {
  const data = unwrapResume(resume) || {};

  return {
    ...data,
    id: data.id ?? data.resume_id,
    title: data.title ?? '',
    content: data.content ?? '',
    createdAt: data.createdAt ?? data.created_at ?? data.created,
    updatedAt:
      data.updatedAt ??
      data.updated_at ??
      data.modified ??
      data.created_at ??
      data.created,
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
  const response = await axiosInstance.delete(`/resumes/${resumeId}/delete/`);

  return response.data;
};
