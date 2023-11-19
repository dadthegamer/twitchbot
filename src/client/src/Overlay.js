import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import styles from './styles/overlay/OverlayLayout.module.css';

function OverlayLayout() {
    return (
        <div className={styles['overlay-layout']}>
            <Outlet />
        </div>
    );
}