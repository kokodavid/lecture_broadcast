export const formatConfirmationMessage = (className, schedule) => {
    return `Please confirm your class "${className}" scheduled for ${schedule}. Reply YES to confirm or NO to cancel.`;
  };
  
  export const formatStudentNotification = (className, schedule, isConfirmed) => {
    return isConfirmed
      ? `Your class "${className}" has been confirmed for ${schedule}.`
      : `Your class "${className}" scheduled for ${schedule} has been cancelled.`;
  };