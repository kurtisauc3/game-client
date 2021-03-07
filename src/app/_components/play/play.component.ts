import { Component } from '@angular/core';
import { BcAuthenticateResponse, LobbyMode, LobbyType } from '@models';
import { ApiService, ElectronService } from '@services';
import { formatMessage } from 'devextreme/localization';
import { dxButtonOptions } from 'devextreme/ui/button';
import dxForm from 'devextreme/ui/form';
import { Observable } from 'rxjs';
import notify from 'devextreme/ui/notify'
import dxTabPanel, { dxTabPanelItem } from 'devextreme/ui/tab_panel';
import { dxRadioGroupOptions } from 'devextreme/ui/radio_group';
import { map } from 'jquery';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.less']
})
export class PlayComponent
{
	formatMessage = formatMessage;

	lobby$: Observable<any>

	constructor(private api: ApiService, private electron: ElectronService)
	{
		this.setupVariables();
	}


	setupVariables()
	{
		this.lobby$ = this.api.getLobby();
		this.lobby$.subscribe(console.log)
	}

}
