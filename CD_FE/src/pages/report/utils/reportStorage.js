const parseSavedArray = (storageKey) => {
  try {
    const savedValue = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(savedValue) ? savedValue : [];
  } catch {
    return [];
  }
};

export const saveTrendResult = (storageKey, value) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const rawDate = `${month}/${day}`;

  const savedData = parseSavedArray(storageKey);

  const sameDateItems = savedData.filter((item) => item.rawDate === rawDate);
  const label =
    sameDateItems.length === 0
      ? rawDate
      : `${rawDate} (${sameDateItems.length})`;

  const newEntry = {
    rawDate,
    label,
    value,
  };

  const updatedData = [...savedData, newEntry];
  localStorage.setItem(storageKey, JSON.stringify(updatedData));

  return updatedData;
};

export const getTrendResult = (storageKey) => {
  return parseSavedArray(storageKey);
};
const DELETED_REPORT_IDS_KEY = 'deletedReportIds';

export const getDeletedReportIds = () => {
  return parseSavedArray(DELETED_REPORT_IDS_KEY);
};

export const saveDeletedReportIds = (ids) => {
  localStorage.setItem(DELETED_REPORT_IDS_KEY, JSON.stringify(ids));
};

export const addDeletedReportId = (id) => {
  const deletedIds = getDeletedReportIds();

  if (deletedIds.includes(id)) return;

  saveDeletedReportIds([...deletedIds, id]);
};

export const restoreDeletedReportId = (id) => {
  const deletedIds = getDeletedReportIds();

  saveDeletedReportIds(deletedIds.filter((deletedId) => deletedId !== id));
};

export const clearDeletedReportIds = () => {
  localStorage.removeItem(DELETED_REPORT_IDS_KEY);
};
