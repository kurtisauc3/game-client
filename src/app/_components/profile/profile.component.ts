import { Component } from '@angular/core';
import { BcAuthenticateResponse } from '@models';
import { ApiService, ElectronService } from '@services';
import { formatMessage } from 'devextreme/localization';
import { dxButtonOptions } from 'devextreme/ui/button';
import dxForm from 'devextreme/ui/form';
import { Observable } from 'rxjs';
import notify from 'devextreme/ui/notify'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent
{
	formatMessage = formatMessage;

	// form: dxForm;
	// profile$: Observable<BcAuthenticateResponse>;

	constructor(private api: ApiService, private electron: ElectronService)
	{
		this.setupVariables();
	}


	setupVariables()
	{
		// this.profile$ = this.api.getProfile();
	}

	// onFieldDataChanged(e)
	// {
	// 	if (this.form.validate().isValid)
	// 	{
	// 		switch (e.dataField)
	// 		{
	// 			case "playerName":
	// 				this.tryUpdatePlayerName(e.value)
	// 				break;
	// 			case "pictureUrl":
	// 				this.tryUpdatePictureUrl(e.value)
	// 				break;
	// 		}
	// 	}
	// }

	// async tryUpdatePlayerName(playerName: string)
	// {
	// 	try
	// 	{
	// 		await this.api.updateUserName(playerName);
	// 		await this.api.readUserState();
	// 		notify(formatMessage("updatePlayerNameSuccess", []), "success");
	// 	}
	// 	catch (error)
	// 	{
	// 		notify(formatMessage("updatePlayerNameError", []), "error");
	// 	}
	// }

	// async tryUpdatePictureUrl(pictureUrl: string)
	// {
	// 	try
	// 	{
	// 		await this.api.updateUserPictureUrl(pictureUrl);
	// 		await this.api.readUserState();
	// 		notify(formatMessage("updateUserPictureUrlSuccess", []), "success");
	// 	}
	// 	catch (error)
	// 	{
	// 		notify(formatMessage("updateUserPictureUrlError", []), "error");
	// 	}
	// }

}
