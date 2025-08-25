import React from 'react';

// PUBLIC_INTERFACE
export default function ProtectedNote({ children }) {
  /** Small muted helper text block used across pages. */
  return <div className="footer-note">{children}</div>;
}
