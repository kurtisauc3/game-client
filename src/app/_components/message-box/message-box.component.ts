import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { BcMessage, BcMessagingContext } from '@models';
import { ApiService, ElectronService, MessageService } from '@services';
import CustomStore from 'devextreme/data/custom_store';
import { formatMessage } from 'devextreme/localization';
import dxDataGrid from 'devextreme/ui/data_grid';
import 'devextreme/integration/jquery';
import notify from 'devextreme/ui/notify'
import dxTextBox from 'devextreme/ui/text_box';
import DataSource from 'devextreme/data/data_source';
import { filter, takeUntil } from 'rxjs/operators';
import { ReplaySubject, merge } from 'rxjs';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.less']
})
export class MessageBoxComponent implements OnDestroy, AfterViewInit
{
	formatMessage = formatMessage;

	private destroyed$: ReplaySubject<boolean>;

	dataGrid: dxDataGrid;
	dataSource: CustomStore;
	textBox: dxTextBox;

	@Input() theirProfileId: string;

	constructor(private api: ApiService, private electron: ElectronService, private message: MessageService)
	{
		this.setVariables();
	}

	setVariables()
	{
		this.destroyed$ = new ReplaySubject(1)
		this.dataSource = new CustomStore({
			load: async(loadOptions) =>
			{
				const response = await this.api.getMessagesPage(this.context);
				return response.results.items;
			},
			onLoaded: (data: BcMessage[]) => this.tryMarkMessagesRead(data.filter(msg => msg.msgbox === 'inbox' && !msg.read).map(msg => msg.msgId)),
			key: "msgId"
		});
	}

	ngAfterViewInit()
	{
		merge(
			this.message.getSelectedIndex(),
			this.message.getUnreadMessages()
		).pipe(
			filter(() => this.focusedAndUnreadFilter),
			takeUntil(this.destroyed$)
		).subscribe(() => this.dataGrid.refresh());
	}

	ngOnDestroy()
	{
		this.destroyed$.next(true);
    this.destroyed$.complete();
	}

	onEnterKey(e)
	{
		const component: dxTextBox = e.component;
		const text: string = component.option("value");
		component.option("value", null);
		if (text?.length && this.theirProfileId?.length)
		{
			this.trySendMessage(text);
		}
	}

	onContentReady(e)
	{
		this.textBox.focus();
		this.scrollToEnd();
	}

	scrollToEnd()
	{
		const lastRowKey = this.dataGrid.getKeyByRowIndex(this.dataGrid.totalCount() - 1);
		this.dataGrid.navigateToRow(lastRowKey);
	}

	async tryMarkMessagesRead(msgIds: string[])
	{
		try 
		{
			if (msgIds.length)
			{
				await this.api.markMessagesRead("inbox", msgIds);
				this.message.tryLoadUnreadMessages([this.theirProfileId]);
			}
		}
		catch (error)
		{
			notify(formatMessage("markMessagesReadError", []), "error");
		}
	}

	async trySendMessage(text: string)
	{
		try 
		{
			await this.api.sendMessageSimple([this.theirProfileId], text);
			await this.dataGrid.refresh();
		}
		catch (error)
		{
			notify(formatMessage("sendMessageError", []), "error");
		}
	}

	get focusedAndUnreadFilter(): boolean
	{
		return this.message.tabPanelItems[this.message.selectedIndex]?.text === this.theirProfileId && this.message.unreadMessages[this.theirProfileId] > 0;
	}

	get profileId(): string
	{
		return this.api.profile.profileId;
	}

	get context(): BcMessagingContext
	{
		let searchCriteria = {};
		if (this.theirProfileId)
		{
			searchCriteria = {
				"message.from.id": { "$in": [ this.theirProfileId, this.profileId ] },
				"message.to": { "$in": [ this.theirProfileId, this.profileId ] },
			}
		}
		return {
			searchCriteria,
			sortCriteria: {
				mbCr: 1
			}
		}
	}

}
