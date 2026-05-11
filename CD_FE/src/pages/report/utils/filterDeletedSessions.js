export function filterDeletedSessions(data) {
  const deletedSessions =
    JSON.parse(localStorage.getItem('deletedReportSessions')) || [];

  return data.filter((item) => !deletedSessions.includes(item.session));
}
