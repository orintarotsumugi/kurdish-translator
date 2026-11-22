/**
 * app-storage.js — Local storage and application preferences manager.
 */
const AppStorage = (() => {
  const DEFAULT_OPTIONS = {
    includeOriginal: false,
    accuracyToggle: false,
    keepOnly: false,
    kurdishDigitsToggle: false,
    contextAwareToggle: true,
    fixOverlapToggle: false,
    addBomToggle: false,
    crlfToggle: false,
  };

  function get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) {
      console.warn(`AppStorage.get("${key}") failed:`, e);
      return fallback;
    }
  }

  function set(key, val) {
    try {
      localStorage.setItem(key, String(val));
    } catch (e) {
      console.warn(`AppStorage.set("${key}") failed:`, e);
      if (typeof Toast !== 'undefined') {
        Toast.show('Storage Warning', 'warning', { subtext: 'Could not save settings to local storage.' });
      }
    }
  }

  // These are the exact keys app.js persists. The reader used to look for
  // "opt_*" keys that nothing ever wrote, so loadOptions() always returned the
  // defaults; the legacy opt_* spelling is still accepted for old installs.
  const OPTION_KEYS = {
    includeOriginal: 'includeOriginal',
    accuracyToggle: 'accuracy',
    keepOnly: 'keepOnly',
    kurdishDigitsToggle: 'kurdishDigits',
    contextAwareToggle: 'contextAware',
    fixOverlapToggle: 'fix_overlap',
    addBomToggle: 'addBom',
    crlfToggle: 'useCrlf',
  };

  function readOption(name, fallback) {
    const key = OPTION_KEYS[name] || name;
    const value = get(key, null);
    if (value !== null) return value;
    return get('opt_' + name, fallback);
  }

  function loadOptions() {
    return {
      includeOriginal: readOption('includeOriginal', '0') === '1',
      accuracyToggle: readOption('accuracyToggle', '0') === '1',
      keepOnly: readOption('keepOnly', '0') === '1',
      kurdishDigitsToggle: readOption('kurdishDigitsToggle', '0') === '1',
      contextAwareToggle: readOption('contextAwareToggle', '1') !== '0',
      fixOverlapToggle: readOption('fixOverlapToggle', '0') === '1',
      addBomToggle: readOption('addBomToggle', '0') === '1',
      crlfToggle: readOption('crlfToggle', '0') === '1',
    };
  }

  function saveOption(key, val) {
    set(OPTION_KEYS[key] || key, val ? '1' : '0');
  }

  return {
    get,
    set,
    loadOptions,
    saveOption,
    DEFAULT_OPTIONS,
    OPTION_KEYS,
  };
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined' && typeof window === 'undefined') {
  module.exports = AppStorage;
}
