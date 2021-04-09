import { Device } from "../";
import { DeviceType, Trait } from "../Enums";
import { IOnOff } from "../interfaces/Traits";
import TelnetClient from 'telnet-client';

export enum Commands {
	/** Power on */
	PWON = 'PWON',

	/** Power off */
	PWSTANDBY = 'PWSTANDBY',


	/** Volume up */
	MVUP = 'MVUP',

	/** Volume down */
	MVDOWN = 'MVDOWN',

	
	/** Set input source to "Phono" */
	SIPHONO = 'SIPHONO',
	
	/** Set input source to "CD" */
	SICD = 'SICD',
	
	/** Set input source to "Tuner" */
	SITUNER = 'SITUNER',
	
	/** Set input source to "DVD" */
	SIDVD = 'SIDVD',
	
	/** Set input source to "BD" */
	SIBD = 'SIBD',
	
	/** Set input source to "TV" */
	SITV = 'SITV',
	
	/** Set input source to "SAT/CBL" */
	SISATCBL  = 'SISAT/CBL',
	
	/** Set input source to "DVR" */
	SIDVR = 'SIDVR',
	
	/** Set input source to "Game" */
	SIGAME = 'SIGAME',
	
	/** Set input source to "Game 2" */
	SIGAME2 = 'SIGAME2',
	
	/** Set input source to "V.AUX" */
	SIVAUX = 'SIV.AUX',
	
	/** Set input source to "Dock" */
	SIDOCK = 'SIDOCK',
	
	/** Set input source to "HDRADIO" */
	SIHDRADIO = 'SIHDRADIO',
	
	/** Set input source to "iPod" */
	SIIPOD = 'SIIPOD',
	
	/** Set input source to "NET/USB" */
	SINETUSB = 'SINET/USB',
	
	/** Set input source to "RHAPSODY" */
	SIRHAPSODY = 'SIRHAPSODY',
	
	/** Set input source to "NAPSTER" */
	SINAPSTER = 'SINAPSTER',
	
	/** Set input source to "PANDORA" */
	SIPANDORA = 'SIPANDORA',
	
	/** Set input source to "LASTFM" */
	SILASTFM = 'SILASTFM',
	
	/** Set input source to "FLICKR" */
	SIFLICKR = 'SIFLICKR',
	
	/** Set input source to "FAVORITES" */
	SIFAVORITES = 'SIFAVORITES',
	
	/** Set input source to "IRADIO" */
	SIIRADIO = 'SIIRADIO',
	
	/** Set input source to "SERVER" */
	SISERVER = 'SISERVER',
	
	/** Set input source to "USB/IPOD" */
	SIUSBIPOD = 'SIUSB/IPOD',
	
	/** Set input source to "USB" */
	SIUSB = 'SIUSB',
	
	/** Set input source to "IPD" */
	SIIPD = 'SIIPD',
	
	/** Set input source to "IRP" */
	SIIRP = 'SIIRP',
	
	/** Set input source to "FVP" */
	SIFVP = 'SIFVP',
}

export default class DenonAvr extends Device implements IOnOff {
	Name: string;
	_id: string;
	Type: DeviceType = DeviceType.Multimedia;
	Status: boolean = false;
	Traits: Trait[] = [Trait.OnOff];

	host: string;
    // denon: DenonAVR;
	con: TelnetClient;

	constructor(Name: string, id: string) {
		super();
		
		this.Name = Name;
		this._id = id;
	}

	public async Run() {
        if (this.host) {
			this.con = new TelnetClient();

			// these parameters are just examples and most probably won't work for your use-case.
			let params = {
				host: this.host,
				port: 23,
				sendTimeout: 1200,
				execTimeout: 1200,
				negotiationMandatory: false,
				shellPrompt: '',
				irs: '\r',
				ors: '\r',
			}

			try {
				await this.con.connect(params);
				this.con.on('data', data => {
					switch ((<Buffer>data).toString().replace('\r', '')) {
						case Commands.PWON: this.Status = true; break;
						case Commands.PWSTANDBY: this.Status = false; break;
					}

					global.eventHandler.fire('change', this);
				});

				this.SendCommand('PW?');
			} catch(error) {
				console.error(`Wasn't able to connect to Denon AVR: ${error}`);
			}
        }
	}

	public SendCommand(cmd: Commands|string): void {
		this.con.send(cmd);
	}

	public TurnOn(): void {
		this.Status = true;
        this.SendCommand(Commands.PWON);
		global.eventHandler.fire('change', this);
	}
	public TurnOff(): void {
		this.Status = false;
		this.SendCommand(Commands.PWSTANDBY);
		global.eventHandler.fire('change', this);
	}
	public Toggle(): void {
		this.Status ? this.TurnOff() : this.TurnOn();
	}
}