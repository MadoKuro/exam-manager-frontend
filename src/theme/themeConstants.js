/**
 * Theme Constants
 * Centralized color palette, gradients, and layout values
 */

export const COLORS = {
    // Primary Colors
    primaryMain: '#00cc88',
    primaryLight: '#33d6a0',
    primaryDark: '#00a36d',

    // Secondary Colors
    secondaryMain: '#8b5cf6',
    secondaryLight: '#a78bfa',
    secondaryDark: '#7c3aed',

    // Status Colors
    errorMain: '#ef4444',
    errorLight: '#fef2f2',
    errorDark: '#dc2626',

    warningMain: '#f59e0b',
    warningLight: '#fef3c7',
    warningDark: '#d97706',

    successMain: '#10b981',
    successLight: '#d1fae5',
    successDark: '#059669',

    infoMain: '#3b82f6',
    infoLight: '#dbeafe',
    infoDark: '#2563eb',
};

export const GRADIENTS = {
    // Brand gradient (Green -> Purple)
    brand: 'linear-gradient(135deg, #00cc88 0%, #8b5cf6 100%)',
    brandHover: 'linear-gradient(135deg, #33d6a0 0%, #a78bfa 100%)',

    // Accent bars
    accentBar: 'linear-gradient(to bottom, #00cc88, #8b5cf6)',
};

export const LAYOUT = {
    drawerWidth: 260,
    borderRadius: {
        mini: 0.5,
        xsmall: 2,
        small: 4,
        medium: 8,
        large: 10,
        xlarge: 12,
        pill: 20,
    },
};

export const SHADOWS = {
    glow: {
        primary: '0 0 8px rgba(139, 92, 246, 0.5)',
        button: '0 4px 12px rgba(0, 204, 136, 0.2)',
        buttonHover: '0 8px 16px rgba(139, 92, 246, 0.25)',
        icon: '0 8px 24px rgba(0, 204, 136, 0.3)',
    },
};

export const OPACITY = {
    activeBackground: 'rgba(139, 92, 246, 0.08)',
    activeBackgroundHover: 'rgba(139, 92, 246, 0.12)',
    badgeBackground: {
        light: 'rgba(0, 0, 0, 0.04)',
        dark: 'rgba(255, 255, 255, 0.05)',
    },
};

export const GLASSMORPHISM = {
    // Floating glass sidebar effect
    sidebar: {
        light: 'rgba(255, 255, 255, 0.65)',
        dark: 'rgba(17, 24, 39, 0.65)',
        blur: 'blur(20px)',
        border: {
            light: 'rgba(255, 255, 255, 0.8)',
            dark: 'rgba(55, 65, 81, 0.5)',
        },
    },
    // Glass card effect
    card: {
        light: 'rgba(255, 255, 255, 0.7)',
        dark: 'rgba(31, 41, 55, 0.7)',
        blur: 'blur(20px)',
        border: {
            light: 'rgba(255, 255, 255, 0.6)',
            dark: 'rgba(55, 65, 81, 0.4)',
        },
    },
    // Glassmorphic top bar
    appBar: {
        light: 'rgba(255, 255, 255, 0.5)',
        dark: 'rgba(17, 24, 39, 0.5)',
        blur: 'blur(10px)',
    },
};

export const ANIMATIONS = {
    // Transition timing
    duration: {
        fast: '0.2s',
        normal: '0.3s',
        slow: '0.4s',
    },
    // Easing functions
    easing: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        springy: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    // Hover transforms
    hover: {
        translateY: 'translateY(-8px)',
        translateX: 'translateX(4px)',
    },
};

