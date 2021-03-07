import { Component } from '@angular/core';
import {  BcGroup } from '@models';
import { ApiService, ElectronService } from '@services';
import CustomStore from 'devextreme/data/custom_store';
import { formatMessage } from 'devextreme/localization';
import dxDataGrid from 'devextreme/ui/data_grid';

import { ContextMenuItem } from 'src/typings';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.less']
})
export class TeamsComponent
{
	formatMessage = formatMessage;

	dataGrid: dxDataGrid;
	dataSource: CustomStore;

	constructor(private api: ApiService, private electron: ElectronService)
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
				const response = await this.api.getMyGroups();
				return response.groups;
			},
			key: "groupId"
		});
	}

	onContextMenuPreparing(e)
	{
		const datagrid: dxDataGrid = e.component;
		const dataRow = e.row.rowType === "data";
		const group: BcGroup = e.row.data;
		const groupId: string = e.row.key;
		if (dataRow && group)
		{
			e.items = <ContextMenuItem[]>[];
		}
	}

}
