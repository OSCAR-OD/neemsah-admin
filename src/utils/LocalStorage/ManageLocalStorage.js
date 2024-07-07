// Set in local storage
export const setLocalStorage = (name, value) => {
  if (window !== "undefined") {
    localStorage.setItem(name, JSON.stringify(value));
  }
};

// Get in local storage
export const getLocalStorage = (name) => {
  if (window !== "undefined" || localStorage.getItem(name)) {
    return JSON.parse(localStorage.getItem(name));
  }
};

// Remove from local storage
export const removeLocalStorage = (name) => {
  if (window !== "undefined") {
    localStorage.removeItem(name);
  }
};
