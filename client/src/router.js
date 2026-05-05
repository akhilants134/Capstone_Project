import { useState } from 'react';

/* ── Simple hash-based router ── */
function Router({ page, navigate }) {
  switch (page) {
    case 'login':       return <div />;  // handled by AuthContext
    case 'register':    return <div />;
    case 'dashboard':   return <div />;
    default:            return null;
  }
}

export { Router };
