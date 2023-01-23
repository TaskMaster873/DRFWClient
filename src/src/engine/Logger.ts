let lightenColor = function(color: string, percent: number) {
    color = color.replace('#', '');
    let num = parseInt(color,16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;
    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};

export class Logger {
    public moduleName: string = 'Logger';
    public logColor: string = '#ffffff';

    public hideLogs: boolean = false;

    private pink: string = '#ff00ff';
    private lightPink: string = lightenColor(this.pink, 75);

    private purple: string = '#9400d3';
    private lightPurple: string = lightenColor(this.purple, 15);

    private green: string = '#7cfc00';
    private lightGreen: string = lightenColor(this.green, 15);

    private moca: string = '#ffdead';
    private lightMoca: string = lightenColor(this.moca, 15);

    private orange: string = '#ff8c00';
    private lightOrange: string = lightenColor(this.orange, 15);

    private red: string = '#ff4500';
    private lightRed: string = lightenColor(this.red, 15);

    private white: string = '#ffffff';
    private lightWhite: string = lightenColor(this.white, 15);

    private darkred: string = '#8b0000';
    private lightdarkred: string = lightenColor(this.darkred, 15);

    private getStartPrefix() : string {
        let startPrefix: string = '';
        return startPrefix;
    }

    constructor(moduleName?: string, logColor?: string, hideLogs?: boolean) {
        if(moduleName !== null && moduleName) {
            this.moduleName = moduleName;
        }

        if(logColor !== null && logColor) {
            this.logColor = logColor;
        }

        if(hideLogs !== null && hideLogs) {
            this.hideLogs = hideLogs;
        }
    }

    public log(...args: any[]) : void {
        if(!this.hideLogs) {
            let light = lightenColor(this.logColor, 15);

            console.log(`%c${this.getStartPrefix()}[${this.moduleName} LOG]: %c` + args.join(' '), `color: ${this.logColor}`, `color: #${light}`);
        }
    }

    public error(...args: any[]) : void {
        console.log(`%c${this.getStartPrefix()}[${this.moduleName} ERROR]: %c` + args.join(' '), `color: ${this.red}`, `color: #${this.lightRed}`);
    }

    public warn(...args: any[]) : void {
        console.log(`%c${this.getStartPrefix()}[${this.moduleName} WARN]: %c` + args.join(' '), `color: ${this.orange}`, `color: #${this.lightOrange}`);
    }
}