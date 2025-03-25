import Experience from './Experience/Experience.js';

const params = {
    muted: false,
};

const experience = new Experience(document.querySelector('canvas.webgl'));

experience.world.on('collect', (money) => {
    const moneyElement = document.getElementById('money');
    moneyElement.innerText = money;
});

experience.resources.on('ready', () => {

    const buttonMappings = {
        'corn-button': 'CORN',
        'grape-button': 'GRAPE',
        'strawberry-button': 'STRAWBERRY',
        'tomato-button': 'TOMATO',
        'cow-button': 'COW',
        'sheep-button': 'SHEEP',
        'chicken-button': 'CHICKEN',
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

const soundButton = document.getElementById('sound-button');
soundButton.addEventListener('click', (event) => {
    event.stopPropagation();

    params.muted = !params.muted;
    experience.world.muteMusic(params.muted);

    if (params.muted) {
        soundButton.classList.add("gray");
    } else {
        soundButton.classList.remove("gray");
    }

});




