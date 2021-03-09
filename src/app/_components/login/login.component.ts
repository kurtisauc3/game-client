import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BcAuthenticateResponse, LoginRequest, LoginType } from '@models';
import { ApiService, ElectronService, MessageService, ProfileService } from '@services';
import { formatMessage } from 'devextreme/localization';
import dxForm, { dxFormButtonItem, dxFormEmptyItem, dxFormSimpleItem } from 'devextreme/ui/form';
import dxPopup from 'devextreme/ui/popup';
import dxSelectBox from 'devextreme/ui/select_box';
import notify from 'devextreme/ui/notify'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements AfterViewInit
{
	formatMessage = formatMessage;
	LoginType = LoginType;

	form: dxForm;
	type: LoginType;

	constructor(private profile: ProfileService, private api: ApiService, private electron: ElectronService, private message: MessageService)
	{
		this.setupVariables();
	}

	setupVariables()
	{
		this.type = LoginType.login;
	}

	ngAfterViewInit()
	{
		this.updateForm();
	}

	debugQuickSwitch(e)
	{
		const text = e.component.option('text')
		this.tryLogin({email: text, password: text});
	}

	updateForm(type = LoginType.login)
	{
		this.type = type;
		const items = [];
		const userNameItem: dxFormSimpleItem = {
			dataField: "userName",
			label: {
				visible: false
			},
			editorOptions: {
				placeholder: formatMessage("userName", [])
			},
			validationRules: [
				{
					type: "required",
				},
				{
					type: "stringLength",
					min: 3,
					max: 16
				}
			]
		};
		const emailItem: dxFormSimpleItem = {
			dataField: "email",
			label: {
				visible: false
			},
			editorOptions: {
				placeholder: formatMessage("email", [])
			},
			validationRules: [
				{
					type: "required",
				},
				{
					type: "email"
				}
			]
		};
		const passwordItem: dxFormSimpleItem = {
			dataField: "password",
			label: {
				visible: false
			},
			editorOptions: {
				mode: "password",
				placeholder: formatMessage("password", [])
			},
			validationRules: [
				{
					type: "required",
				}
			]
		};
		const confirmPasswordItem: dxFormSimpleItem = {
			dataField: "confirmPassword",
			label: {
				visible: false
			},
			editorOptions: {
				mode: "password",
				placeholder: formatMessage("confirmPassword", [])
			},
			validationRules: [
				{
					type: "compare",
					comparisonTarget: this.passwordComparison.bind(this)
				}
			]
		}
		const loginItem: dxFormSimpleItem = {
			template: "login"
		}
		const createItem: dxFormSimpleItem = {
			template: "create"
		}
		const forgotPasswordItem: dxFormSimpleItem = {
			template: "forgotPassword"
		}
		const submitItem: dxFormButtonItem = {
			itemType: "button",
			horizontalAlignment: "center",
			buttonOptions: {
				text: formatMessage(`${LoginType[this.type]}Submit`, []),
				width: "100%",
				useSubmitBehavior: true,
				type: "success"
			}
		}
		const debugItem: dxFormSimpleItem = {
			template: "debugQuickSwitch"
		}
		switch (this.type)
		{
			case LoginType.login:
				items.push(
					emailItem,
					passwordItem,
					forgotPasswordItem,
					debugItem
				);
				break;
			case LoginType.create:
				items.push(
					emailItem,
					userNameItem,
					{
						...passwordItem,
						validationRules: this.strongPasswordRules
					},
					confirmPasswordItem,
				);
				break;
			case LoginType.forgotPassword:
				items.push(
					emailItem
				);
				break;
		}
		items.push(submitItem);
		switch (this.type)
		{
			case LoginType.login:
				items.push(createItem);
				break;
			case LoginType.create:
			case LoginType.forgotPassword:
				items.push(loginItem);
				break;
		}
		this.form.beginUpdate();
		this.form.option("formData", {});
		this.form.option("items", items);
		this.form.endUpdate();
	}

	getGoToButton(type: LoginType): dxFormButtonItem
	{
		return {
			itemType: "button",
			horizontalAlignment: "left",
			cssClass: "button-spacer",
			buttonOptions: {
				stylingMode: "text",
				text: formatMessage("goToCreate", []),
				onClick: () => this.updateForm(type)
			}
		}
	}

	passwordComparison(): string
	{
		return this.form.getEditor("password").option("value");
	}

	onFormSubmit(e)
	{
		e.preventDefault();
		const request: LoginRequest = this.form.option('formData');
		switch (this.type)
		{
			case LoginType.login:
				this.tryLogin(request);
				break;
			case LoginType.create:
				this.tryCreate(request);
				break;
			case LoginType.forgotPassword:
				notify(formatMessage("comingSoon", []));
				break;
		}
	}

	async tryLogin(request: LoginRequest)
	{
		try
		{
			const profile = await this.api.authenticateEmailPassword(request.email, request.password, false);
			this.profile.setProfile(profile);
		}
		catch (error)
		{
			notify(formatMessage("loginInvalid", []), "error");
		}
	}

	async tryCreate(request: LoginRequest)
	{
		try
		{
			await this.api.authenticateEmailPassword(request.email, request.password, true)
			await this.api.updateUserName(request.userName);
			this.tryLogin(request);
		}
		catch (error)
		{
			notify(formatMessage("createInvalid", []), "error");
		}
	}

	get strongPasswordRules(): dxFormSimpleItem["validationRules"]
	{
		return [
			{
				type: "required"
			},
			// {
			// 	type: "pattern",
			// 	pattern: new RegExp("(?=.{8,})"),
			// 	message: formatMessage("eightCharactersExpr", [])
			// },
			// {
			// 	type: "pattern",
			// 	pattern: new RegExp("(?=.*[a-z])"),
			// 	message: formatMessage("oneLowerCaseExpr", [])
			// },
			// {
			// 	type: "pattern",
			// 	pattern: new RegExp("(?=.*[A-Z])"),
			// 	message: formatMessage("oneUpperCaseExpr", [])
			// },
			// {
			// 	type: "pattern",
			// 	pattern: new RegExp("(?=.*[0-9])"),
			// 	message: formatMessage("oneNumberExpr", [])
			// },
			// {
			// 	type: "pattern",
			// 	pattern: new RegExp("(?=.[!@#\$%\^&])"),
			// 	message: formatMessage("oneSpecialExpr", [])
			// },

		];
	}

}
