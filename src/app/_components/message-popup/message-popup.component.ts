import { Component } from '@angular/core';
import { BcMessage, BcRttMessage } from '@models';
import { ApiService, ElectronService, MessageService } from '@services';
import { formatMessage } from 'devextreme/localization';
import 'devextreme/integration/jquery';

import dxPopup from 'devextreme/ui/popup';
import dxTabPanel, { dxTabPanelItem } from 'devextreme/ui/tab_panel';
import { dxButtonOptions } from 'devextreme/ui/button';
import dxToolbar, { dxToolbarItem } from 'devextreme/ui/toolbar';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.less']
})
export class MessagePopupComponent
{
	formatMessage = formatMessage;

	visible$: Observable<boolean>;
	selectedIndex$: Observable<number>;
	toolbar: dxToolbar;
	toolbarItems: dxToolbarItem[];
	popup: dxPopup;
	tabPanel: dxTabPanel;
	tabPanelItems$: Observable<dxTabPanelItem[]>;

	constructor(private api: ApiService, private electron: ElectronService, private message: MessageService)
	{
		this.bindThisToDomFunctions();
		this.setVariables();
	}

	bindThisToDomFunctions()
	{
	}

	setVariables()
	{
		this.visible$ = this.message.getMessageWindowVisible();
		this.selectedIndex$ = this.message.getSelectedIndex();
		this.tabPanelItems$ = this.message.getTabPanelItems();
		this.toolbarItems = [{
			widget: "dxButton",
			location: "after",
			options: <dxButtonOptions>{
				icon: "close",
				hint: formatMessage('close', []),
				stylingMode: "text",
				onClick: (e) => this.message.setMessageWindowVisible(false)
			}
		}];
	}

	onContentReady(e)
	{
		e.element.find(".dx-popup-content").css("padding", "0");
	}

	onSelectionChanged(e)
	{
		const selectedIndex = e.component.option('selectedIndex');
		if (selectedIndex !== this.message.selectedIndex)
		{
			this.message.setSelectedIndex(selectedIndex);
		}
	}

	onCloseMessageClick(profileId: string)
	{
		this.message.closeMessage(profileId);
	}

}
