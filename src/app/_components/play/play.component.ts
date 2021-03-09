import { Component } from '@angular/core';
import { ApiService, ElectronService } from '@services';
import { formatMessage } from 'devextreme/localization';
import { Observable } from 'rxjs';


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
	}

}
