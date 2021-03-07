import { Injectable } from '@angular/core';
import { locale, loadMessages } from 'devextreme/localization';
import { enCustom } from '@assets';

@Injectable({
	providedIn: 'root'
})
export class LanguageService
{

	constructor ()
    {
	}

	initialize()
	{
		loadMessages(enCustom);
		locale(navigator.language);
	}

}
