import { Component } from '@angular/core';
import { BcMatch } from '@models';
import { ApiService, ElectronService } from '@services';
import CustomStore from 'devextreme/data/custom_store';
import { formatMessage } from 'devextreme/localization';
import dxDataGrid from 'devextreme/ui/data_grid';

import { ContextMenuItem } from 'src/typings';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.less']
})
export class MatchHistoryComponent
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
				const response = await this.api.findCompleteMatches();
				return response.results;
			},
			key: "matchId"
		});
	}

	onContextMenuPreparing(e)
	{
		const datagrid: dxDataGrid = e.component;
		const dataRow = e.row.rowType === "data";
		const match: BcMatch = e.row.data;
		const matchId: string = e.row.key;
		if (dataRow && match)
		{
			e.items = <ContextMenuItem[]>[];
		}
	}

}
