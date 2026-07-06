/* ── Simple hash-based router ── */
function Router({ page }) {
  switch (page) {
    case 'login':       return <div />;  // handled by AuthContext
    case 'register':    return <div />;
    case 'dashboard':   return <div />;
    default:            return null;
  }
}

export { Router };
