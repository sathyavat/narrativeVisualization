// Navigation logic
document.addEventListener('DOMContentLoaded', function() {
    // Scene paths array
    const scenes = [
        '../index.html',
        'scene1.html',
        'scene2.html',
        'scene3.html',
        'conclusion.html'
    ];

    // Handle "Begin Exploration" button on index.html
    const beginExplorationBtn = document.getElementById('begin-exploration');
    if (beginExplorationBtn) {
        beginExplorationBtn.addEventListener('click', function() {
            window.location.href = 'html/scene1.html';
        });
    }

    // Handle "Previous" and "Next" buttons
    const prevSceneBtn = document.getElementById('prev-scene');
    const nextSceneBtn = document.getElementById('next-scene');
    const currentPath = window.location.pathname;

    // Find the current scene index
    let currentIndex = scenes.findIndex(scene => currentPath.includes(scene.replace('../', '')));

    // Handle "Previous" button click
    if (prevSceneBtn && currentIndex > 0) {
        prevSceneBtn.addEventListener('click', function() {
            window.location.href = scenes[currentIndex - 1];
        });
    }

    // Handle "Next" button click
    if (nextSceneBtn && currentIndex < scenes.length - 1) {
        nextSceneBtn.addEventListener('click', function() {
            window.location.href = scenes[currentIndex + 1];
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
