import axiosInstance from './axiosInstance';
import { mockResumes } from '../mockdata/resumeMock';

const FORCE_MOCK_DATA = false;
const MOCK_RESUME_STORAGE_KEY = 'mockResumes';

const getStoredMockResumes = () => {
  const stored = localStorage.getItem(MOCK_RESUME_STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(MOCK_RESUME_STORAGE_KEY, JSON.stringify(mockResumes));
    return mockResumes;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : mockResumes;
  } catch {
    return mockResumes;
  }
};

const setStoredMockResumes = (resumes) => {
  localStorage.setItem(MOCK_RESUME_STORAGE_KEY, JSON.stringify(resumes));
};

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
  if (FORCE_MOCK_DATA) {
    return normalizeResume(
      getStoredMockResumes().find(
        (resume) => String(resume.id) === String(resumeId),
      ),
    );
  }

  const response = await axiosInstance.get(`/resumes/${resumeId}/`);

  return normalizeResume(response.data);
};

export const getResumes = async () => {
  if (FORCE_MOCK_DATA) {
    return getStoredMockResumes().map(normalizeResume);
  }

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
  if (FORCE_MOCK_DATA) {
    const now = new Date().toISOString();
    const resumes = getStoredMockResumes();
    const newResume = {
      id: `mock-resume-${Date.now()}`,
      title,
      content,
      createdAt: now,
      updatedAt: now,
      isDefault: resumes.length === 0,
    };

    setStoredMockResumes([newResume, ...resumes]);
    return normalizeResume(newResume);
  }

  const response = await axiosInstance.post('/resumes/create/', {
    title,
    content,
  });

  return normalizeResume(response.data);
};

export const updateResume = async ({ resumeId, title, content }) => {
  if (FORCE_MOCK_DATA) {
    const resumes = getStoredMockResumes();
    const now = new Date().toISOString();
    const updatedResume = {
      ...(resumes.find((resume) => String(resume.id) === String(resumeId)) ||
        {}),
      id: resumeId,
      title,
      content,
      updatedAt: now,
    };

    setStoredMockResumes(
      resumes.map((resume) =>
        String(resume.id) === String(resumeId) ? updatedResume : resume,
      ),
    );
    return normalizeResume(updatedResume);
  }

  const response = await axiosInstance.put(`/resumes/${resumeId}/update/`, {
    title,
    content,
  });

  return normalizeResume(response.data);
};

export const deleteResume = async (resumeId) => {
  if (FORCE_MOCK_DATA) {
    setStoredMockResumes(
      getStoredMockResumes().filter(
        (resume) => String(resume.id) !== String(resumeId),
      ),
    );
    return { success: true };
  }

  const response = await axiosInstance.delete(`/resumes/${resumeId}/delete/`);

  return response.data;
};
