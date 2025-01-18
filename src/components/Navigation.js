import React from 'react';

const NavigationButton = ({ isSelected, onClick, children }) => (
    <div style={{
        backgroundColor: isSelected ? '#00674B' : '#B2D8CE',
        padding: '0rem',
        borderRadius: '0.75rem',
        width: '300px',
        display: 'inline-block'
    }}>
        <div
            onClick={onClick}
            style={{
                cursor: 'pointer',
                borderRadius: '0.5rem',
                transition: 'all 0.2s',
                backgroundColor: isSelected ? '#00674B' : 'transparent',
                color: isSelected ? 'white' : 'white',

            }}
        >
            <div style={{
                padding: '1rem 2rem',
                fontWeight: '500',
                fontSize: '1.125rem',
                textAlign: 'center'
            }}>
                {children}
            </div>
        </div>
    </div>
);

const Navigation = ({ onPageChange, currentPage }) => {
    return (
        <div style={{
            width: '100%',
            maxWidth: '64rem',
            margin: '0 auto',
            padding: '1rem',
            marginBottom: '2rem'
        }}>
            <div style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                alignItems: 'stretch'
            }}>
                <NavigationButton
                    isSelected={currentPage === 'busyTimes'}
                    onClick={() => onPageChange('busyTimes')}
                >
                    Find Busy Times
                </NavigationButton>

                <NavigationButton
                    isSelected={currentPage === 'scheduler'}
                    onClick={() => onPageChange('scheduler')}
                >
                    Schedule Demo
                </NavigationButton>
            </div>
        </div>
    );
};

export default Navigation;