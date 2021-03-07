import { Injectable } from '@angular/core';
import { formatMessage } from 'devextreme/localization';
import { BehaviorSubject } from 'rxjs';
import { BcRttLobby } from '@models';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class LobbyService
{

	private _lobby: BehaviorSubject<BcRttLobby>;

	constructor(private api: ApiService)
	{
	}

	initialize()
	{
		this._lobby = new BehaviorSubject(null);
	}

	clear()
	{
		this.setLobby(null);
	}

	get lobby()
	{
		return this._lobby.value;
	}

	getLobby()
	{
		return this._lobby.asObservable();
	}

	setLobby(data: BcRttLobby)
	{
		this._lobby.next(data);
	}

}
