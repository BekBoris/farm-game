import {Audio, AudioListener, AudioLoader} from 'three';
import Experience from "../Experience.js";

const sounds = [
    {name: 'chicken', url: 'sounds/chicken.mp3', volume: 1},
    {name: 'cow', url: 'sounds/cow.mp3', volume: 1},
    {name: 'drop', url: 'sounds/drop.mp3', volume: 1},
    {name: 'harvest', url: 'sounds/harvest.mp3', volume: 1},
    {name: 'sheep', url: 'sounds/sheep.mp3', volume: 1.4},
    {name: 'theme', url: 'sounds/theme.mp3', volume: 1, isMusic: true},
    {name: 'click', url: 'sounds/click.mp3', volume: 1},
];

export default class Sounds {
    constructor() {

        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.listener = new AudioListener();
        this.camera.instance.add(this.listener);

        this.loader = new AudioLoader();
        this.sounds = {};

        this.music = null;
        this.musicLoaded = false;

        this.loadSounds(sounds);
    }

    loadSounds(soundsArray) {
        soundsArray.forEach(({name, url, isMusic, volume}) => {
            this.loader.load(url, (buffer) => {
                    if (isMusic) {

                        this.music = new Audio(this.listener);
                        this.music.setBuffer(buffer);
                        this.music.setLoop(true);
                        this.setMusicVolume(volume);
                        this.musicLoaded = true;
                        this.initMusic();

                    } else {

                        this.sounds[name] = {
                            audio: new Audio(this.listener),
                            loaded: true,
                        };
                        this.sounds[name].audio.setBuffer(buffer);
                        this.setSoundVolume(name, volume);
                    }
                },

                undefined,
                (error) => {
                    console.error(`Error loading sound: ${url}`, error);
                });

            if (!isMusic) {
                this.sounds[name] = {
                    audio: null,
                    loaded: false,
                };
            }
        });
    }

    initMusic() {
        const onUserGesture = () => {
            this.playMusic();
            window.removeEventListener('mousemove', onUserGesture);
            window.removeEventListener('click', onUserGesture);
        };

        window.addEventListener('mousemove', onUserGesture);
        window.addEventListener('click', onUserGesture);
    }

    playMusic() {
        if (!this.musicLoaded) {
            console.warn('Music not yet loaded!');
            return;
        }
        if (this.music && !this.music.isPlaying) {
            this.music.play();
        }
    }

    stopMusic() {
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }
    }

    playSound(name, reset = false) {
        const soundObj = this.sounds[name];
        if (!soundObj) {
            console.warn(`Sound "${name}" was never initialized!`);
            return;
        }
        if (!soundObj.loaded) {
            console.warn(`Sound "${name}" is not loaded yet!`);
            return;
        }

        const sound = soundObj.audio;

        if (sound && sound.isPlaying && reset) {
            return;
        }

        if (sound && sound.isPlaying && !reset) {
            sound.stop();
        }
        sound.play();
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.music) {
            this.music.setVolume(volume);
        }
    }

    setSoundVolume(name, volume) {
        const sound = this.sounds[name];
        sound.audio.setVolume(volume);
    }
}
