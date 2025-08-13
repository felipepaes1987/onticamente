
import React from 'react';
import { useAssistant } from '../../context/AssistantContext';

const Colibri = () => {
  const { setOpen } = useAssistant();

  return (
    <button
      onClick={() => setOpen(true)}
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        width: 180,
        height: 180,
        zIndex: 10000,
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        padding: 0
      }}
      aria-label="Abrir assistente Colibri"
    >
      <img src="/colibri_animado.gif" alt="Colibri Assistente" style={{ width: '100%', height: '100%' }} />
    </button>
  );
};

export default Colibri;
