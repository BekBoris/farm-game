import GUI from 'lil-gui'

export default class Debug
{
    constructor()
    {
        this.active /*= window.location.hash === '#debug'*/ = true

        if(this.active)
        {
            this.ui = new GUI()
        }
    }
}
