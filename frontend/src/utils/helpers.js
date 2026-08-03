import { CATEGORIES, STATUSES } from './constants';

export function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelative(dateStr) {
  if (!dateStr) return '';
  var now = new Date();
  var d = new Date(dateStr);
  var diff = now - d;
  var mins = Math.floor(diff / 60000);
  var hrs = Math.floor(diff / 3600000);
  var days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + 'm ago';
  if (hrs < 24) return hrs + 'h ago';
  if (days < 7) return days + 'd ago';
  return formatDate(dateStr);
}

export function truncate(str, len) {
  if (!str) return '';
  len = len || 80;
  return str.length > len ? str.substring(0, len) + '...' : str;
}

export function getCategoryLabel(value) {
  var found = CATEGORIES.find(function (c) { return c.value === value; });
  return found ? found.label : value;
}

export function getCategoryColor(value) {
  var found = CATEGORIES.find(function (c) { return c.value === value; });
  return found ? found.color : '#64748B';
}

export function getStatusInfo(value) {
  var found = STATUSES.find(function (s) { return s.value === value; });
  return found || STATUSES[2];
}

export function getGreeting() {
  var h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getAssetUrl(value, fallback = null) {
  if (!value || typeof value !== 'string') return fallback;

  var trimmedValue = value.trim();
  if (!trimmedValue) return fallback;

  if (/^https?:\/\//i.test(trimmedValue) || trimmedValue.startsWith('data:image/')) {
    return trimmedValue;
  }

  var apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';
  var backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  if (trimmedValue.startsWith('/')) {
    return backendBaseUrl ? backendBaseUrl + trimmedValue : trimmedValue;
  }

  return trimmedValue;
}

export function compressImage(file, maxW, quality) {
  maxW = maxW || 600;
  quality = quality || 0.7;
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        var w = img.width;
        var h = img.height;
        if (w > maxW) {
          h = (maxW / w) * h;
          w = maxW;
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}