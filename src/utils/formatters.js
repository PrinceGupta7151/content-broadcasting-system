export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = formatDate;

export const formatContentType = (type) => {
  const types = {
    video: 'Video',
    document: 'Document',
    presentation: 'Presentation',
    image: 'Image',
    other: 'Other'
  };
  return types[type] || 'Unknown';
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getContentStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    draft: 'Draft',
  };
  return statusMap[status] || 'Unknown';
};

export const formatStatus = (status) => {
  const statuses = {
    pending: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected',
    draft: 'Draft'
  };
  return statuses[status] || status;
};