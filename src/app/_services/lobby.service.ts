import { Injectable } from '@angular/core';
import { formatMessage } from 'devextreme/localization';
import { BehaviorSubject } from 'rxjs';
import { BcLobby, BcServer, BC_REASON_CODE, GameScreen } from '@models';
import { ApiService } from './api.service';
import notify from 'devextreme/ui/notify';

@Injectable({
	providedIn: 'root'
})
export class LobbyService
{

	private _screen: BehaviorSubject<GameScreen>;
	private _lobby: BehaviorSubject<BcLobby>;
	private _server: BehaviorSubject<BcServer>;

	constructor(private api: ApiService)
	{
	}

	initialize()
	{
		this._lobby = new BehaviorSubject(null);
		this._server = new BehaviorSubject(null);
		this._screen = new BehaviorSubject(GameScreen.selectLobby);
	}

	clear()
	{
		this.setLobby(null);
		this.setServer(null);
		this.setScreen(GameScreen.selectLobby);
	}

	onEvent(result)
	{
		console.log(result);
		// If there is a lobby object present in the message, update our lobby
		if (result.data.lobby)
		{
			this.setLobby(result.data);

			// If we were joining lobby, show the lobby screen.
			if (this.screen === GameScreen.joiningLobby)
			{
					this.setScreen(GameScreen.lobby);
			}
		}

		if (result.operation === "DISBANDED")
		{
				if (result.data.reason.code === BC_REASON_CODE.ROOM_LAUNCHED)
				{
						// Server has been created. Connect to it
						this.connectToRelay();
				}
				else
				{
						// Disbanded for any other reason than ROOM_READY, means we failed to launch the game.
						this.onGameScreenClose();
				}
		}
		else if (result.operation === "STARTING")
		{
				// Game is starting, show loading screen
				this.setScreen(GameScreen.connecting)
		}
		else if (result.operation === "ROOM_READY")
		{
				// Server has been created, save connection info.
				this.setServer(result.data);
		}
	}

	async connectToRelay()
	{
		this.api.getRelay().subscribe(console.log);
		this.api.getSystem().subscribe(console.log);
		try
		{
			await this.api.connectRelay({
				ssl: false,
				host: this.server.connectData.address,
				port: this.server.connectData.ports.ws,
				passcode: this.server.passcode,
				lobbyId: this.server.lobbyId
			});
		}
		catch (error)
		{

		}
	}

	onGameScreenClose()
	{
			this.api.disconnectRelay();
			this.api.deregisterRelayCallback();
			this.api.deregisterSystemCallback();
			this.clear();
			
	}

	get screen()
	{
		return this._screen.value;
	}

	getScreen()
	{
		return this._screen.asObservable();
	}

	setScreen(data: GameScreen)
	{
		this._screen.next(data);
	}

	get lobby()
	{
		return this._lobby.value;
	}

	getLobby()
	{
		return this._lobby.asObservable();
	}

	setLobby(data: BcLobby)
	{
		this._lobby.next(data);
	}

	get server()
	{
		return this._server.value;
	}

	getServer()
	{
		return this._server.asObservable();
	}

	setServer(data: BcServer)
	{
		this._server.next(data);
	}

}
