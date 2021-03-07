import { Component } from '@angular/core';
import { BcEvent } from '@models';
import { ApiService, ElectronService } from '@services';
import CustomStore from 'devextreme/data/custom_store';
import { formatMessage } from 'devextreme/localization';
import dxDataGrid from 'devextreme/ui/data_grid';
import { ContextMenuItem } from 'src/typings';
import notify from 'devextreme/ui/notify'

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.less']
})
export class EventListComponent
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
			load: async (loadOptions) => {
				const response = await this.api.getEvents();
				return response.incoming_events;
			},
			key: "evId"
		});
	}

	onContextMenuPreparing(e)
	{
		const datagrid: dxDataGrid = e.component;
		const dataRow = e.row.rowType === "data";
		const event: BcEvent = e.row.data;
		const evId: string = e.row.key;
		if (dataRow && event)
		{
			e.items = <ContextMenuItem[]>[];
		}
	}

	async tryDeleteIncomingEvent(evId: string)
	{
		try 
		{
			await this.api.deleteIncomingEvent(evId);
			await this.dataGrid.refresh();
		}
		catch (error)
		{
			notify(formatMessage("deleteIncomingEventError", []), "error");
		}

	}

}
