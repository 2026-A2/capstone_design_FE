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
