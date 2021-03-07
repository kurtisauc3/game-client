import { Component } from '@angular/core';
import { BcAuthenticateResponse, CreateLobbyRequest, LobbyMode, LobbyType, TeamCode } from '@models';
import { ApiService, ElectronService } from '@services';
import { formatMessage } from 'devextreme/localization';
import { dxButtonOptions } from 'devextreme/ui/button';
import dxForm from 'devextreme/ui/form';
import { Observable } from 'rxjs';
import notify from 'devextreme/ui/notify'
import { dxRadioGroupOptions } from 'devextreme/ui/radio_group';

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
	lobbyTypeEditorOptions: dxRadioGroupOptions;
	lobbyModeEditorOptions: dxRadioGroupOptions;
	selectButtonOptions: dxButtonOptions;

	constructor(private api: ApiService, private electron: ElectronService)
	{
		this.setupVariables();
	}


	setupVariables()
	{
		this.lobbyTypeEditorOptions = {
			items: [
				LobbyType.singles,
				LobbyType.doubles,
				LobbyType.volleyball,
				LobbyType.ironman,
			]
		};
		this.lobbyModeEditorOptions = {
			items: [
				LobbyMode.unranked,
				LobbyMode.ranked,
				LobbyMode.custom
			]
		}
		this.selectFormData = {
			lobbyType: LobbyType.singles,
			rating: 0,
			otherUserCxIds: [],
			settings: {
				lobbyMode: LobbyMode.unranked
			},
			isReady: true,
			extraJson: {},
			teamCode: TeamCode.team1
		}
		this.selectButtonOptions = {
			text: formatMessage('createLobby', []),
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
			await this.api.createLobby(this.selectFormData);
		}
		catch (error)
		{
			notify(formatMessage("createLobbyError", []), "error");
		}
	}

}
