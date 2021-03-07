import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
	DxFormModule,
	DxPopupModule,
	DxButtonModule,
	DxTabPanelModule,
	DxDataGridModule,
	DxToolbarModule,
	DxDropDownButtonModule,
	DxAccordionModule,
	DxLookupModule,
	DxTextBoxModule,
	DxSortableModule,
	DxTabsModule
} from 'devextreme-angular';
import { AngularSplitModule } from 'angular-split';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { 
	LoginComponent,
	FriendListComponent,
	EventListComponent,
	ProfileComponent,
	MatchHistoryComponent, 
	TeamsComponent,
	MessageBoxComponent,
	MessagePopupComponent,
	ClosePopupComponent,
	UnreadMessageNotificationComponent,
	PlayComponent,
	SelectGameComponent

} from '@components';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		PlayComponent,
		ProfileComponent,
		FriendListComponent,
		EventListComponent,
		MatchHistoryComponent,
		TeamsComponent,
		MessageBoxComponent,
		MessagePopupComponent,
		ClosePopupComponent,
		UnreadMessageNotificationComponent,
		SelectGameComponent

	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		DxFormModule,
		DxPopupModule,
		DxButtonModule,
		DxTabPanelModule,
		DxDataGridModule,
		DxToolbarModule,
		DxDropDownButtonModule,
		DxAccordionModule,
		DxLookupModule,
		DxTextBoxModule,
		DxSortableModule,
		DxTabsModule,
		AngularSplitModule.forRoot()
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
