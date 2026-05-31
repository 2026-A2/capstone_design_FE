import axiosInstance from './axiosInstance';

export const createResume = async ({ title, content }) => {
  const response = await axiosInstance.post('/resumes/create/', {
    title,
    content,
  });

  if (!response.data || typeof response.data !== 'object') {
    throw new Error('Invalid resume create response');
  }

  return response.data;
};
