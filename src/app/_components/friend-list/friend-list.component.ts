import { Component } from '@angular/core';
import { BcFindPlayer, BcPresence } from '@models';
import { ApiService, ElectronService, MessageService } from '@services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { formatMessage } from 'devextreme/localization';
import { dxButtonOptions } from 'devextreme/ui/button';
import dxDataGrid from 'devextreme/ui/data_grid';
import 'devextreme/integration/jquery';
import { dxSelectBoxOptions } from 'devextreme/ui/select_box';
import { dxToolbarItem } from 'devextreme/ui/toolbar';
import { ContextMenuItem } from 'src/typings';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.less']
})
export class FriendListComponent
{
	formatMessage = formatMessage;

	dataGrid: dxDataGrid;
	dataSource: CustomStore;
	userIdEditorOptions: dxSelectBoxOptions;

	constructor(private api: ApiService, private electron: ElectronService, private message: MessageService)
	{
		this.bindThisToDomFunctions();
		this.setVariables();
	}

	bindThisToDomFunctions()
	{
	}

	async setVariables()
	{
		this.dataSource = new CustomStore({
			load: async (loadOptions) =>
			{
				const response = await this.api.getPresenceOfFriends("All", true);
				return response.presence;
			},
			onLoaded: (data: BcPresence[]) => this.message.tryLoadUnreadMessages(data.map(p => p.user.id)),
			key: "user.id",
			insert: async (values: BcPresence) => this.api.addFriends([values.user.id]),
			remove: async (profileId: string) => this.api.removeFriends([profileId]),
		});
		this.userIdEditorOptions = {
			dataSource: new DataSource({
				load: async (loadOptions) =>
				{
					const response = await this.api.findUsersByNameStartingWith(loadOptions.searchValue, loadOptions.take);
					return response.matches;
				},
				key: "profileId"
			}),
			noDataText: formatMessage('noUsers', []),
			minSearchLength: 3,
			searchEnabled: true,
			showClearButton: true,
			width: "420",
			placeholder: formatMessage("searchForUser", []),
			displayExpr: (player: BcFindPlayer) => player && `${player.profileName} (${player.profileId})`,
			valueExpr: "profileId"
		};
	}
	
	onToolbarPreparing(e)
	{
		e.toolbarOptions.items.push(
			<dxToolbarItem>{
				widget: "dxButton",
				location: "after",
				options: <dxButtonOptions>{
					icon: "plus",
					hint: formatMessage('addFriend', []),
					type: "success",
					stylingMode: "text",
					onClick: (e) => this.dataGrid.addRow()
				}
			},
			<dxToolbarItem>{
				widget: "dxButton",
				location: "after",
				options: <dxButtonOptions>{
					icon: "email",
					hint: formatMessage('message', []),
					stylingMode: "text",
					onClick: (e) => this.message.setMessageWindowVisible(true)
				}
			}
		);
	}

	onContextMenuPreparing(e)
	{
		const datagrid: dxDataGrid = e.component;
		const dataRow = e.row.rowType === "data";
		const index: number = e.row.rowIndex;
		const friend: BcPresence = e.row.data;
		const profileId: string = e.row.key;
		if (dataRow && friend)
		{
			e.items = <ContextMenuItem[]>[
				{
					text: formatMessage("invite", []),
					onItemClick: (e) => this.tryInvite(profileId)
				},
				{
					text: formatMessage("message", []),
					onItemClick: (e) => this.tryMessage(friend)
				},
				{
					text: formatMessage("profile", []),
					onItemClick: (e) => this.tryProfile(profileId)
				},
				{
					text: formatMessage("unfriend", []),
					onItemClick: (e) => this.dataGrid.deleteRow(index)
				}
			];
		}
	}

	onRowClick(e)
	{
		this.tryMessage(e.data);
	}

	async tryInvite(profileId)
	{
		console.log("invite", profileId);
	}

	async tryProfile(profileId)
	{
		console.log("profile", profileId);
	}

	async tryMessage(friend: BcPresence)
	{
		this.message.openMessage(friend.user.id, friend.user.name, null)
	}

}
