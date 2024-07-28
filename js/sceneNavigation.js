// Navigation logic
document.addEventListener('DOMContentLoaded', function() {
    // Handle "Begin Exploration" button on index.html
    const beginExplorationBtn = document.getElementById('begin-exploration');
    if (beginExplorationBtn) {
        beginExplorationBtn.addEventListener('click', function() {
            window.location.href = 'html/scene1.html';
        });
    }

    // Handle "Previous" button
    const prevSceneBtn = document.getElementById('prev-scene');
    if (prevSceneBtn) {
        prevSceneBtn.addEventListener('click', function() {
            const currentPath = window.location.pathname;
            if (currentPath.includes('scene1.html')) {
                window.location.href = '../index.html';
            } else if (currentPath.includes('scene2.html')) {
                window.location.href = 'scene1.html';
            } else if (currentPath.includes('scene3.html')) {
                window.location.href = 'scene2.html';
            } else if (currentPath.includes('conclusion.html')) {
                window.location.href = 'scene3.html';
            }
        });
    }

    // Handle "Next" button
    const nextSceneBtn = document.getElementById('next-scene');
    if (nextSceneBtn) {
        nextSceneBtn.addEventListener('click', function() {
            const currentPath = window.location.pathname;
            if (currentPath.includes('scene1.html')) {
                window.location.href = 'scene2.html';
            } else if (currentPath.includes('scene2.html')) {
                window.location.href = 'scene3.html';
            } else if (currentPath.includes('scene3.html')) {
                window.location.href = 'conclusion.html';
            }
        });
    }

    // Handle "Back to Start" button on conclusion.html
    const backToStartBtn = document.getElementById('back-to-start');
    if (backToStartBtn) {
        backToStartBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
});
