export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const isValidFutureDate = (date) => {
    const futureDate = new Date(date);
    const now = new Date();
    return futureDate > now;
  };