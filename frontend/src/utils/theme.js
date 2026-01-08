export function applyTheme(mode) {
  const root = document.documentElement;
  const setClass = (isDark) => {
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  };

  // Default to light unless user explicitly chooses dark
  if (mode === 'dark') setClass(true);
  else setClass(false);
}

export function getPreferredTheme(role = 'student') {
  try {
    const raw = localStorage.getItem(`prefs:${role}`);
    if (!raw) return 'system';
    const parsed = JSON.parse(raw);
    return parsed?.theme || 'system';
  } catch {
    return 'system';
  }
}
