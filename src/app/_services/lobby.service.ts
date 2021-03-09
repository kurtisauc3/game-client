import { Injectable } from '@angular/core';
import { formatMessage } from 'devextreme/localization';
import { BehaviorSubject } from 'rxjs';
import { BcLobby, BcServer } from '@models';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class LobbyService
{

	private _lobby: BehaviorSubject<BcLobby>;
	private _server: BehaviorSubject<BcServer>;

	constructor(private api: ApiService)
	{
	}

	initialize()
	{
		this._lobby = new BehaviorSubject(null);
		this._server = new BehaviorSubject(null);
	}

	clear()
	{
		this.setLobby(null);
		this.setServer(null);
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
