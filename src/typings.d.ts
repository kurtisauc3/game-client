/* SystemJS module definition */
import { dxElement } from 'devextreme/core/element';
import { dxEvent } from 'devextreme/events';
import dxContextMenu, { dxContextMenuItem } from 'devextreme/ui/context_menu';
declare const nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  process: any;
  require: any;
}

export interface ContextMenuItem extends dxContextMenuItem
{
	onItemClick?: ((e: { component?: dxContextMenu, element?: dxElement, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: JQuery | dxEvent }) => any) | string;
}

