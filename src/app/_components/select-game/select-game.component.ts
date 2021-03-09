import { Component } from '@angular/core';
import { CreateLobbyRequest } from '@models';
import { ApiService, ElectronService } from '@services';
import { formatMessage } from 'devextreme/localization';
import { dxButtonOptions } from 'devextreme/ui/button';
import dxForm from 'devextreme/ui/form';
import notify from 'devextreme/ui/notify'

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.component.html',
  styleUrls: ['./select-game.component.less']
})
export class SelectGameComponent
{
	formatMessage = formatMessage;

	selectForm: dxForm;
	selectFormData: CreateLobbyRequest;
	quickPlayButtonOptions: dxButtonOptions;

	constructor(private api: ApiService, private electron: ElectronService)
	{
		this.setupVariables();
	}


	setupVariables()
	{
		this.selectFormData = {
			lobbyType: "singles",
			rating: 0,
			maxSteps: 1,
			algo: {
				strategy: "ranged-absolute",
				alignment: "center",
				ranges: [1000]
			},
			filterJson: {},
			otherUserCxIds: [],
			settings: {},
			isReady: true,
			extraJson: {},
			teamCode: ""
		}
		this.quickPlayButtonOptions = {
			text: formatMessage('quickPlay', []),
			stylingMode: "contained",
			type: "success",
			useSubmitBehavior: true
		}
	}

	onFormSubmit(e)
	{
		e.preventDefault;
		this.tryCreateLobby();
	}

	async tryCreateLobby()
	{
		try
		{
			await this.api.findOrCreateLobby(this.selectFormData);
		}
		catch (error)
		{
			notify(formatMessage("createLobbyError", []), "error");
		}
	}

}
