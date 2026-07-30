import React, { useEffect }     from 'react';
import { createPortal }         from 'react-dom';

export default function Toast({ show, type, message, duration = 3000, onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                // 关键：通知父组件把状态改回 false
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    const style = {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 20px',
        borderRadius: '4px',
        color: '#fff',
        zIndex: 99999,
        backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
    };

    return createPortal(
        <div style={style}>{message}</div>,
        document.body
    );
}