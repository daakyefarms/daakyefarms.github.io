module.exports = {
            theme: {
                extend: {
                    colors: {
                        farm: {
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            500: '#22c55e',
                            700: '#15803d',
                            800: '#166534',
                            900: '#14532d',
                            950: '#052e16',
                        },
                        amber: {
                            400: '#fbbf24',
                            500: '#f59e0b',
                            600: '#d97706',
                            700: '#b45309',
                        }
                    },
                    animation: {
                        'float': 'float 4s ease-in-out infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-8px)' },
                        }
                    }
                }
            }
        ,
 content: ['./*.html', './assets/js/*.js']
};
