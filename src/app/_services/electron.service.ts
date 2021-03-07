import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, remote } from 'electron';

@Injectable({
	providedIn: 'root'
})
export class ElectronService
{
	ipcRenderer: typeof ipcRenderer;
	webFrame: typeof webFrame;
	remote: typeof remote;

	constructor()
	{
	}

	initialize()
	{
		if (this.isElectron)
		{
			this.ipcRenderer = window.require('electron').ipcRenderer;
			this.webFrame = window.require('electron').webFrame;
			this.remote = window.require('electron').remote;

			// set custom titlebar
			const { Titlebar, Color } = window.require('custom-electron-titlebar');
			const titlebar = new Titlebar({
				backgroundColor: Color.TRANSPARENT,
				maximizable: false,
				menu: null
			});
		}

	}

	get isElectron(): boolean
	{
		return !!(window && window.process && window.process.type);
	}

	reload()
	{
		if (this.isElectron)
		{
			this.remote.getCurrentWindow().reload();
		}
		else
		{
			window.location.reload();
		}
	}

	exit()
	{
		if (this.isElectron)
		{
			const win = this.remote.getCurrentWindow()
			win.webContents.closeDevTools();
			this.ipcRenderer.send("closed");
		}
	}
}
