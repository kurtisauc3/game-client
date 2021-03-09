import { Component } from '@angular/core';
import { ApiService, ElectronService, MessageService, ProfileService } from '@services';
import { formatMessage } from 'devextreme/localization';
import dxPopup from 'devextreme/ui/popup';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-close-popup',
  templateUrl: './close-popup.component.html',
  styleUrls: ['./close-popup.component.less']
})
export class ClosePopupComponent
{
	formatMessage = formatMessage;

	popup: dxPopup;

	constructor(private profile: ProfileService, private api: ApiService, private electron: ElectronService, private message: MessageService)
	{
		this.listenForClose();
	}

	listenForClose()
	{
		if (this.electron.isElectron)
		{
			this.electron.ipcRenderer.on('app-close', (event) =>
			{
				if (this.profile.profile)
				{
					this.popup.show();
				}
				else
				{
					this.exit();
				}
			});
		}
	}

	async onLogoutClick()
	{
		await this.popup.hide();
		this.tryLogout();
	}

	async tryLogout()
	{
		try
		{
			await this.api.logout();
		}
		catch (error)
		{
			notify(formatMessage("logoutError", []), "error");
		}
		finally
		{
			this.profile.setProfile(null);
		}
	}

	async onExitClick()
	{
		await this.popup.hide();
		this.exit();
	}

	exit()
	{
		this.electron.exit();
	}

}
