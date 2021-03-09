import { Injectable } from '@angular/core';
import { formatMessage } from 'devextreme/localization';
import { BehaviorSubject, Observable } from 'rxjs';
import { BcAuthenticateResponse } from '@models';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class ProfileService
{

	private _profile: BehaviorSubject<BcAuthenticateResponse>;

	constructor(private api: ApiService)
	{
	}

	initialize()
	{
		this._profile = new BehaviorSubject(null);
	}

	clear()
	{
		this.setProfile(null);
	}

	get profile(): BcAuthenticateResponse
	{
		return this._profile.value;
	}

	getProfile(): Observable<BcAuthenticateResponse>
	{
		return this._profile.asObservable();
	}

	setProfile(profile: BcAuthenticateResponse)
	{
		this._profile.next(profile);
	}

}
