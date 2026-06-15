import { useState } from 'react';

export function useConfirmDialog() {
  const [state, setState] = useState({ open: false, title: '', message: '', onConfirm: null, onCancel: null });

  const confirm = ({ title, message }) =>
    new Promise((resolve) => {
      setState({
        open: true,
        title,
        message,
        onConfirm: () => {
          setState((s) => ({ ...s, open: false }));
          resolve(true);
        },
        onCancel: () => {
          setState((s) => ({ ...s, open: false }));
          resolve(false);
        },
      });
    });

  const dialogProps = {
    open: state.open,
    title: state.title,
    message: state.message,
    onConfirm: state.onConfirm,
    onCancel: state.onCancel,
  };

  return { confirm, dialogProps };
}
