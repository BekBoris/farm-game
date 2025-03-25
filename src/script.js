import Experience from './Experience/Experience.js';

const experience = new Experience(document.querySelector('canvas.webgl'));

experience.resources.on('ready', () => {

    const buttonMappings = {
        'corn-button': 'CORN',
        'grape-button': 'GRAPE',
        'strawberry-button': 'STRAWBERRY',
        'tomato-button': 'TOMATO',
        'cow-button': 'COW',
        'sheep-button': 'SHEEP',
    };

    Object.entries(buttonMappings).forEach(([buttonId, assetName]) => {
        const button = document.getElementById(buttonId);
        if (button && assetName) {
            button.addEventListener('click', () => {
                event.stopPropagation();
                experience.world.addFarmAsset(assetName);
            });
        }
    });
});


