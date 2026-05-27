export function filterDeletedSessions(data) {
  const deletedSessions =
    JSON.parse(localStorage.getItem('deletedReportSessions')) || [];

  return data.filter(
    (item) =>
      !deletedSessions.some(
        (session) =>
          String(item.session) === String(session) ||
          String(item.id) === String(session),
      ),
  );
}
