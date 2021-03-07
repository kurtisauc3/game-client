import { Injectable } from '@angular/core';
import { formatMessage } from 'devextreme/localization';
import notify from 'devextreme/ui/notify';
import dxTabPanel, { dxTabPanelItem } from 'devextreme/ui/tab_panel';
import { BehaviorSubject, Observable } from 'rxjs';
import { BcMessage } from '../_models/response';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class MessageService
{

	private _messageWindowVisible: BehaviorSubject<boolean>;
	private _tabPanelItems: BehaviorSubject<dxTabPanelItem[]>;
	private _selectedIndex: BehaviorSubject<number>;
	private _unreadMessages: BehaviorSubject<{[profileId: string]: number}>;

	constructor(private api: ApiService)
	{
	}

	initialize()
	{
		this._messageWindowVisible = new BehaviorSubject(false);
		this._tabPanelItems = new BehaviorSubject([]);
		this._selectedIndex = new BehaviorSubject(-1);
		this._unreadMessages = new BehaviorSubject({});
	}

	clear()
	{
		this.setMessageWindowVisible(false);
		this.setTabPanelItems([]);
		this.setSelectedIndex(-1);
		this._unreadMessages.next({});
	}

	get unreadMessages()
	{
		return this._unreadMessages.value;
	}

	getUnreadMessages()
	{
		return this._unreadMessages.asObservable();
	}

	setUnreadMessages(data: {[profileId: string]: number})
	{
		this._unreadMessages.next({...this.unreadMessages, ...data});
	}

	async tryLoadUnreadMessages(profileIds: string[])
	{
		try
		{
			const responses = await Promise.all(profileIds.map(profileId => this.api.getMessagesPage(this.getUnreadMessagesContext(profileId))));
			const data = {};
			for (let i = 0; i < profileIds.length; i++)
			{
				data[profileIds[i]] = responses[i].results.count;
			}
			this.setUnreadMessages(data);
		}
		catch (error)
		{
			notify(formatMessage('loadUnreadMessagesError', []), 'error');
		}
	}

	get messageWindowVisible(): boolean
	{
		return this._messageWindowVisible.value;
	}

	getMessageWindowVisible(): Observable<boolean>
	{
		return this._messageWindowVisible.asObservable();
	}

	setMessageWindowVisible(visible: boolean)
	{
		this._messageWindowVisible.next(visible);
		if (!visible)
		{
			this.setSelectedIndex(-1);
		} 
	}

	get selectedIndex(): number
	{
		return this._selectedIndex.value;
	}

	getSelectedIndex(): Observable<number>
	{
		return this._selectedIndex.asObservable();
	}

	setSelectedIndex(index: number)
	{
		this._selectedIndex.next(index);
	}

	get tabPanelItems()
	{
		return this._tabPanelItems.value;
	}

	getTabPanelItems()
	{
		return this._tabPanelItems.asObservable();
	}

	setTabPanelItems(tabPanelItems: dxTabPanelItem[])
	{
		this._tabPanelItems.next(tabPanelItems.filter(item => item.text !== this.api.profile.profileId));
	}

	openMessage(profileId: string, profileName: string, unreadMessages: number)
	{
		const items = [...this.tabPanelItems];
		const index = items.findIndex(item => item.text === profileId);
		if (index === -1)
		{
			items.push({
				text: profileId,
				title: profileName,
				badge: unreadMessages ? unreadMessages.toString() : null
			});
			this.setTabPanelItems(items);
		}
		this.setSelectedIndex(this.tabPanelItems.map(item => item.text).indexOf(profileId));
		this.setMessageWindowVisible(true);
	}

	closeMessage(profileId: string)
	{
		this.setTabPanelItems(this.tabPanelItems.filter(item => item.text !== profileId));
		this.setSelectedIndex(this.tabPanelItems.length - 1);
	}

	private getUnreadMessagesContext(profileId: string)
	{
		return {
			searchCriteria: {
				"message.from.id": profileId,
				"message.to": this.api.profile.profileId,
				"read": false,
				"msgbox": "inbox"
			},
			pagination: {
				rowsPerPage: 1,
				pageNumber: 1
			}
		}
	}
}
