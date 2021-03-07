import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

function quit()
{
	if (process.platform !== 'darwin')
	{
		app.quit();
	}
}

function createWindow(): BrowserWindow
{
	const electronScreen = screen;
	const size = electronScreen.getPrimaryDisplay().workAreaSize;
	win = new BrowserWindow({
		width: 1280,
		height: 720,
		resizable: false,
        titleBarStyle: "hidden",
        frame: false,
		webPreferences: {
			nodeIntegration: true,
			allowRunningInsecureContent: (serve) ? true : false,
			contextIsolation: false,
			enableRemoteModule: true
		},
	});
	if (serve)
	{
		win.webContents.openDevTools();
		require('electron-reload')(__dirname, {
			electron: require(`${__dirname}/node_modules/electron`)
		});
		win.loadURL('http://localhost:4200');
	}
	else
	{
		win.loadURL(url.format({
			pathname: path.join(__dirname, 'dist/index.html'),
			protocol: 'file:',
			slashes: true
		}));
	}
	win.on('close', (e) =>
	{
		if (win)
		{
			e.preventDefault();
			win.webContents.send('app-close');
		}
	})
	ipcMain.on('closed', () =>
	{
		win = null;
		quit();
	});
	return win;
}

try
{
	app.on('ready', () => setTimeout(createWindow, 400));
	app.on('window-all-closed', () =>
	{
		quit();
	});
	app.on('activate', () =>
	{
		if (win === null)
		{
			createWindow();
		}
	});
}
catch (e)
{
	// throw e;
}
