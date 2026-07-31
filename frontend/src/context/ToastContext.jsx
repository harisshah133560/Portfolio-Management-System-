import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

var ToastContext = createContext(null);
var toastCounter = 0;

export function ToastProvider(props) {
  var children = props.children;
  var toastsState = useState([]);
  var toasts = toastsState[0];
  var setToasts = toastsState[1];

  var addToast = useCallback(function (message, type, duration) {
    type = type || 'success';
    duration = duration || 4000;
    var id = ++toastCounter;
    setToasts(function (prev) {
      return prev.concat([{ id: id, message: message, type: type, duration: duration }]);
    });
    return id;
  }, []);

  var removeToast = useCallback(function (id) {
    setToasts(function (prev) {
      return prev.filter(function (t) { return t.id !== id; });
    });
  }, []);

  var toast = {
    success: function (msg) { return addToast(msg, 'success'); },
    error: function (msg) { return addToast(msg, 'error'); },
    warning: function (msg) { return addToast(msg, 'warning'); },
    info: function (msg) { return addToast(msg, 'info'); },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map(function (t) {
          return (
            <Toast
              key={t.id}
              id={t.id}
              message={t.message}
              type={t.type}
              duration={t.duration}
              onClose={function () { removeToast(t.id); }}
            />
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  var context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export default ToastContext;