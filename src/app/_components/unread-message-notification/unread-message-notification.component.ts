import { Component, Input, OnInit } from '@angular/core';
import { BcMessagingContext, BcPresence } from '@models';
import { ApiService, MessageService } from '@services';
import { formatMessage } from 'devextreme/localization';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-unread-message-notification',
  templateUrl: './unread-message-notification.component.html',
  styleUrls: ['./unread-message-notification.component.less']
})
export class UnreadMessageNotificationComponent implements OnInit
{
	formatMessage = formatMessage;

	@Input() profileId: string;
	unreadMessages$: Observable<number>;

	constructor(private api: ApiService, private message: MessageService)
	{
	}

	ngOnInit()
	{
		this.unreadMessages$ = this.message.getUnreadMessages().pipe(map(data => data[this.profileId] ?? 0));
	}

}
