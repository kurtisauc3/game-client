import { Component } from '@angular/core';
import { GameScreen } from '@models';
import { ApiService, ElectronService, LobbyService } from '@services';
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

	screen$: Observable<GameScreen>;
	GameScreen = GameScreen;

	constructor(private api: ApiService, private lobby: LobbyService)
	{
		this.setupVariables();
	}


	setupVariables()
	{
		this.screen$ = this.lobby.getScreen();
		this.screen$.subscribe(console.log)
	}

}
