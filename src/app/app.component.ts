import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProfileService, ApiService, DxService, ElectronService, LanguageService, LobbyService, MessageService } from '@services';
import { formatMessage } from 'devextreme/localization';
import { Observable } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators'
import { BcAuthenticateResponse, BcMessagingResponse, BC_REASON_CODE } from '@models';
import dxTabPanel, { dxTabPanelItem } from 'devextreme/ui/tab_panel';
import dxPopup from 'devextreme/ui/popup';
import notify from 'devextreme/ui/notify'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent
{
	formatMessage = formatMessage;

	profile$: Observable<BcAuthenticateResponse>;

	leftTabPanel: dxTabPanel;
	rightTabPanel: dxTabPanel;
	leftTabPanelItems: dxTabPanelItem[];
	rightTabPanelItems: dxTabPanelItem[];

	constructor(private profile: ProfileService, private lobby: LobbyService, private electron: ElectronService, private api: ApiService, private language: LanguageService, private dx: DxService, private message: MessageService)
	{
		this.language.initialize();
		this.electron.initialize();
		this.profile.initialize();
		this.api.initialize();
		this.dx.initialize();
		this.message.initialize();
		this.lobby.initialize();
		this.profile$ = this.profile.getProfile();
		this.setupVariables();
		this.setupSubscriptions();
	}

	setupVariables()
	{
		this.leftTabPanelItems = [
			{
				title: formatMessage("play", []),
				icon: "video",
				template: "playTemplate"
			},
			{
				title: formatMessage("profile", []),
				icon: "user",
				template: "profileTemplate"
			},
			{
				title: formatMessage("matchHistory", []),
				icon: "clock",
				template: "matchHistoryTemplate"
			},
			{
				title: formatMessage("teams", []),
				icon: "group",
				template: "teamsTemplate"
			},
		];
		this.rightTabPanelItems = [
			{
				title: formatMessage("friendList", []),
				template: "friendListTemplate"
			},
			{
				title: formatMessage("eventList", []),
				template: "eventListTemplate"
			},
		];
	}

	setupSubscriptions()
	{
		this.profile$.subscribe(profile =>
		{
			if (profile)
			{
				this.api.enableRTT().then(() =>
				{
					// register callbacks
					this.api.getMessaging().subscribe(data => this.message.onEvent(data));
					this.api.getLobby().subscribe(data => this.lobby.onEvent(data));
				});
			}
			else
			{
				this.api.disableRTT();
				this.message.clear();
				this.lobby.clear();
				// other clear methods here
				this.logout();
			}
		});
	}

	async logout()
	{
		try
		{
			await this.api.logout();
		}
		catch (error)
		{
			//notify(formatMessage("logoutError", []), "error");
		}
	}

}
