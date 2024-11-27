export const formatLectureConfirmationMessage = (lecturer, subject, scheduledDate) => {
  const formattedDate = new Date(scheduledDate).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `Hello ${lecturer.name}, do you confirm your lecture for ${subject} scheduled for ${formattedDate}? Reply with YES or NO.`;
};

export const formatStudentNotificationMessage = (subject, scheduledDate, lecturerName, status) => {
  const formattedDate = new Date(scheduledDate).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${subject} lecture scheduled for ${formattedDate} has been ${status}. - ${lecturerName}`;
};