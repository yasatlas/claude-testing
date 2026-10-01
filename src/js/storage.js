(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.TicTacToe = root.TicTacToe || {};
    root.TicTacToe.storage = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const NAMESPACE = 'tic-tac-toe:';

  function createMemoryStorage() {
    const store = new Map();
    return {
      getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      setItem(key, value) {
        store.set(key, String(value));
      },
      removeItem(key) {
        store.delete(key);
      },
    };
  }

  function resolveBackend() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const testKey = `${NAMESPACE}__test__`;
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        return window.localStorage;
      } catch (error) {
        // localStorage can throw in private browsing modes or when disabled.
        // Fall back to an in-memory store so the app keeps working.
      }
    }
    return createMemoryStorage();
  }

  const backend = resolveBackend();

  return {
    load(key, fallback) {
      const raw = backend.getItem(NAMESPACE + key);
      if (raw === null || raw === undefined) {
        return fallback;
      }
      try {
        return JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },
    save(key, value) {
      backend.setItem(NAMESPACE + key, JSON.stringify(value));
    },
    clear(key) {
      backend.removeItem(NAMESPACE + key);
    },
  };
});
