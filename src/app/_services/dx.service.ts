import { Injectable } from '@angular/core';
import config from "devextreme/core/config";
import fx from "devextreme/animation/fx";
import dxToolbar, { dxToolbarItem, dxToolbarOptions } from "devextreme/ui/toolbar";
import dxPopup, { dxPopupOptions } from "devextreme/ui/popup";
import dxForm, { dxFormOptions } from "devextreme/ui/form";
import dxDataGrid, { dxDataGridOptions } from "devextreme/ui/data_grid";
import { formatMessage } from 'devextreme/localization';
import 'devextreme/integration/jquery';
import dxTabPanel, { dxTabPanelOptions } from 'devextreme/ui/tab_panel';
import dxButton, { dxButtonOptions } from 'devextreme/ui/button';
import dxRadioGroup, { dxRadioGroupOptions } from 'devextreme/ui/radio_group';
import { DxRadioGroupComponent } from 'devextreme-angular';

@Injectable({
	providedIn: 'root'
})
export class DxService
{
	formatMessage = formatMessage;

	constructor ()
	{
	}

	initialize()
	{
		this.setupDxDefaults();
	}

	setupDxDefaults()
	{
		// default styling mode
		config({
			editorStylingMode: "filled"
		});
		// turn fx/animations off
		let dxFx = <any>fx;
		dxFx.off = true;

		dxRadioGroup.defaultOptions({
			options: <dxRadioGroupOptions>{
				displayExpr: (data) => formatMessage(data, [])
			}
		});

		dxButton.defaultOptions({
			options: <dxButtonOptions>{
				
			}
		});
		dxToolbar.defaultOptions({
			options: <dxToolbarOptions>{
				height: 36,

			}
		});
		dxTabPanel.defaultOptions({
			options: <dxTabPanelOptions>{
				height: '100%',
				selectedIndex: 0,
				focusStateEnabled: false,
				deferRendering: false
			}
		});
		dxDataGrid.defaultOptions({
			options: <dxDataGridOptions>{
				height: '100%',
				hoverStateEnabled: true,
				showColumnLines: false,
				showRowLines: false,
				showBorders: false,
				showColumnHeaders: false,
				sorting: {
					mode: "none"
				},
				editing: {
					mode: "popup"
				},
				onToolbarPreparing: (e) =>
				{
					let toolbarItems = e.toolbarOptions.items;
					toolbarItems.push(<dxToolbarItem>{
						widget: "dxButton",
						location: "before",
						locateInMenu: "never",
						options: <dxButtonOptions>{
							icon: "refresh",
							stylingMode: "text",
							type: "default",
							hint: formatMessage('refresh', []),
							onClick: (ev) => e.component.refresh()
						}
					})
				}
			}
		});
		dxPopup.defaultOptions({
			options: <dxPopupOptions>{
				showTitle: false,
				closeOnOutsideClick: true,
				animation: null,
				dragEnabled: false,
				deferRendering: false,
				width: 'auto',
				height: 'auto'
			}
		});
		dxForm.defaultOptions({
			options: <dxFormOptions>{
				scrollingEnabled: true,
				onContentReady: (e) =>
				{
					this.autoFocusFirstDataField(e.component);
				}
			}
		});
	}

	autoFocusFirstDataField(form: dxForm)
	{
		setTimeout(() =>
		{
			const firstDataField = form.option("items")?.find(item => item.dataField)?.dataField;
			if (firstDataField)
			{
				form.getEditor(firstDataField)?.focus();
			}
		}, 100);
	}
}
