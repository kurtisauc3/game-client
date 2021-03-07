import { Injectable } from '@angular/core';
import env from '../../../env-variables.json';
import {
	HTTP_STATUS,
	BcResponse,
	BcAuthenticateResponse,
	BcEventResponse,
	BcChatResponse,
	BcLobbyResponse,
	BcPresenceResponse,
	BcGroupResponse,
	BcEventsResponse,
	EntityResponse,
	BcEntity,
	BcMatchResponse,
	BcFriendsEntitiesResponse,
	BcFindUsersByNameResponse,
	BcMessagingContext,
	BcMessagingResponse,
	BcMessage,
	BC_REASON_CODE,
	BcRttMessage,
	BcMessagesPageResponse,
	BcRttLobby,
	CreateLobbyRequest
} from '@models';
import { BehaviorSubject, bindCallback, Observable } from 'rxjs';
import { ElectronService } from './electron.service';
const { appId, appSecret, appVersion } = env;

@Injectable({
	providedIn: 'root'
})
export class ApiService
{

	private wrapper;
	private _profile: BehaviorSubject<BcAuthenticateResponse>;

	constructor(private electron: ElectronService)
	{
	}

	initialize()
	{
		this._profile = new BehaviorSubject(null);
		const bc = require("braincloud");
		this.wrapper = new bc.BrainCloudWrapper("_wrapper");
		this.wrapper.initialize(appId, appSecret, appVersion);
	}

	get profile(): BcAuthenticateResponse
	{
		return this._profile.value;
	}

	getProfile(): Observable<BcAuthenticateResponse>
	{
		return this._profile.asObservable();
	}

	setProfile(profile: BcAuthenticateResponse)
	{
		this._profile.next(profile);
	}

	convertToObservable(func: Function, ...args): Observable<any>
	{
		return new Observable(observer =>
		{
			try
			{
				func(...args, (response) =>
					observer.next(response?.data),
					error => observer.error(error?.status_message)
				)
			}
			catch (error)
			{
				observer.error(error);
			}
		})
	}

	convertToPromise(func: Function, ...args): Promise<any>
	{
		return new Promise((resolve, reject) =>
		{
			try
			{
				func(...args, (response: BcResponse) =>
				{
					if (response.status === HTTP_STATUS.OK)
					{
						resolve(response.data);
					}
					else
					{
						switch (response.reason_code)
						{
							case BC_REASON_CODE.SESSION_EXPIRED:
							case BC_REASON_CODE.LOGGED_OUT_BY_OTHER_SESSION:
								this.electron.reload();
								break;
						}
						reject(response.status_message);
					}
				}, error => reject(error?.status_message))
			}
			catch (error)
			{
				reject(error);
			}
		})
	}

	convertToPromiseIgnoreStatus(func: Function, ...args): Promise<any>
	{
		return new Promise((resolve, reject) =>
		{
			try
			{
				func(...args, response =>
					resolve(response?.data),
					error => reject(error?.status_message)
				)
			}
			catch (error)
			{
				reject(error);
			}
		})
	}

	/**
	 * Anonymous methods
	 */

	authenticateEmailPassword(email: string, password: string, force_create: boolean): Promise<BcAuthenticateResponse>
	{
		return this.convertToPromise(this.wrapper.authenticateEmailPassword, email, password, force_create);
	}

	getStoredProfileId(): string
	{
		return this.wrapper.getStoredProfileId();
	}

	/**
	 * Authenticated methods
	 */

	logout(): Promise<any>
	{
		return this.convertToPromise(this.wrapper.playerState.logout);
	}

	updateContactEmail(email: string): Promise<any>
	{
		return this.convertToPromise(this.wrapper.playerState.updateContactEmail, email)
	}

	updateUserName(username: string): Promise<any>
	{
		return this.convertToPromise(this.wrapper.playerState.updateUserName, username)
	}

	updateUserPictureUrl(userPictureUrl: string): Promise<any>
	{
		return this.convertToPromise(this.wrapper.playerState.updateUserPictureUrl, userPictureUrl)
	}

	findUserByExactUniversalId(userName: string): Promise<any>
	{
		return this.convertToPromise(this.wrapper.friend.findUserByExactUniversalId, userName);
	}

	findUsersByNameStartingWith(searchText: string, maxResults: number): Promise<BcFindUsersByNameResponse>
	{
		return this.convertToPromise(this.wrapper.friend.findUsersByNameStartingWith, searchText, maxResults);
	}

	getMessagesPage(context: BcMessagingContext): Promise<BcMessagesPageResponse>
	{
		return this.convertToPromise(this.wrapper.messaging.getMessagesPage, context);
	}

	deleteMessages(msgbox: 'inbox' | 'sent', msgIds: string[]): Promise<any>
	{
		return this.convertToPromise(this.wrapper.messaging.deleteMessages, msgbox, msgIds);
	}

	sendMessageSimple(toProfileIds: string[], text: string): Promise<any>
	{
		return this.convertToPromise(this.wrapper.messaging.sendMessageSimple, toProfileIds, text);
	}

	markMessagesRead(msgbox: 'inbox' | 'sent', msgIds: string[]): Promise<any>
	{
		return this.convertToPromise(this.wrapper.messaging.markMessagesRead, msgbox, msgIds);
	}

	getEntitiesByType(entityType: string): Promise<EntityResponse>
	{
		return this.convertToPromise(this.wrapper.entity.getEntitiesByType, entityType);
	}

	getSharedEntitiesForProfileId(profileId: string): Promise<EntityResponse>
	{
		return this.convertToPromise(this.wrapper.entity.getSharedEntitiesForProfileId, profileId);
	}

	getSharedEntitiesListForProfileId(targetProfileId: string, whereJson, orderByJson, maxReturn: number): Promise<EntityResponse>
	{
		return this.convertToPromise(this.wrapper.entity.getSharedEntitiesListForProfileId, targetProfileId, whereJson, orderByJson, maxReturn);
	}

	createEntity(entityType: string, jsonEntityData: any, jsonEntityAcl): Promise<BcEntity>
	{
		return this.convertToPromise(this.wrapper.entity.createEntity, entityType, jsonEntityData, jsonEntityAcl)
	}

	deleteEntity(entityId, version): Promise<any>
	{
		return this.convertToPromise(this.wrapper.entity.deleteEntity, entityId, version)
	}

	getSharedEntityForProfileId(targetProfileId: string, entityId: string): Promise<BcEntity>
	{
		return this.convertToPromise(this.wrapper.entity.getSharedEntityForProfileId, targetProfileId, entityId)
	}

	updateSharedEntity(entityId: string, targetProfileId: string, entityType: string, jsonEntityData: any, version: number): Promise<any>
	{
		return this.convertToPromise(this.wrapper.entity.updateSharedEntity, entityId, targetProfileId, entityType, jsonEntityData, version)
	}

	sendEvent(toId: string, eventType: string, eventData: any): Promise<any>
	{
		return this.convertToPromise(this.wrapper.event.sendEvent, toId, eventType, eventData);
	}

	deleteIncomingEvent(evId): Promise<any>
	{
		return this.convertToPromise(this.wrapper.event.deleteIncomingEvent, evId);
	}

	readUserState(): Promise<BcAuthenticateResponse>
	{
		return this.convertToPromise(this.wrapper.playerState.readUserState);
	}

	getAttributes(): Promise<any>
	{
		return this.convertToPromise(this.wrapper.playerState.getAttributes);
	}

	updateAttributes(attributes, wipeExisting: boolean): Promise<any>
	{
		return this.convertToPromise(this.wrapper.playerState.updateAttributes, attributes, wipeExisting);
	}

	getPresenceOfFriends(friendPlatform, includeOffline): Promise<BcPresenceResponse>
	{
		return this.convertToPromise(this.wrapper.presence.getPresenceOfFriends, friendPlatform, includeOffline);
	}

	readFriendsEntities(entityType: string): Promise<BcFriendsEntitiesResponse>
	{
		return this.convertToPromise(this.wrapper.friend.readFriendsEntities, entityType);
	}

	getEvents(): Promise<BcEventsResponse>
	{
		return this.convertToPromise(this.wrapper.event.getEvents);
	}

	findUsersByExactName(playerName: string, maxResults: number): Promise<any>
	{
		return this.convertToPromise(this.wrapper.friend.findUsersByExactName, playerName, maxResults)
	}

	addFriends(profileIds: string[]): Promise<any>
	{
		return this.convertToPromise(this.wrapper.friend.addFriends, profileIds)
	}

	removeFriends(profileIds: string[]): Promise<any>
	{
		return this.convertToPromise(this.wrapper.friend.removeFriends, profileIds)
	}

	createGroup(name, groupType, isOpenGroup, acl, jsonData, ownerAttributes, defaultMemberAttributes)
	{
		return this.convertToPromise(this.wrapper.group.createGroup, name, groupType, isOpenGroup, acl, jsonData, ownerAttributes, defaultMemberAttributes)
	}

	inviteGroupMember(groupId, profileId, role, jsonAttributes)
	{
		return this.convertToPromise(this.wrapper.group.inviteGroupMember, groupId, profileId, role, jsonAttributes)
	}

	getMyGroups(): Promise<BcGroupResponse>
	{
		return this.convertToPromise(this.wrapper.group.getMyGroups);
	}

	findCompleteMatches(): Promise<BcMatchResponse>
	{
		return this.convertToPromise(this.wrapper.asyncMatch.findCompleteMatches);
	}
	
	createLobby(request: CreateLobbyRequest)
	{
		return this.convertToPromise(
			this.wrapper.lobby.createLobby,
			request.lobbyType,
			request.rating,
			request.otherUserCxIds,
			request.isReady,
			request.extraJson,
			request.teamCode,
			request.settings
			);
	}

	/**
	 * RTT methods
	 */

	getConnectionStatus(): Promise<any>
	{
		return this.wrapper.rttService.getConnectionStatus();
	}

	enableRTT(): Promise<any>
	{
		return this.convertToPromiseIgnoreStatus(this.wrapper.rttService.enableRTT);
	}

	disableRTT(): void
	{
		this.wrapper.rttService.disableRTT();
	}

	getRTTEnabled(): boolean
	{
		return this.wrapper.rttService.getRTTEnabled();
	}

	getEvent(): Observable<BcEventResponse>
	{
		return this.convertToObservable(this.wrapper.rttService.registerRTTEventCallback);
	}

	getChat(): Observable<BcChatResponse>
	{
		return this.convertToObservable(this.wrapper.rttService.registerRTTChatCallback);
	}

	getLobby(): Observable<BcRttLobby>
	{
		return this.convertToObservable(this.wrapper.rttService.registerRTTLobbyCallback);
	}

	getMessaging(): Observable<BcRttMessage>
	{
		return this.convertToObservable(this.wrapper.rttService.registerRTTMessagingCallback);
	}

	getFriends(platform: string, biDirectional: boolean): Observable<BcPresenceResponse>
	{
		return this.convertToObservable(this.wrapper.presence.registerListenersForFriends, platform, biDirectional);
	}

	getProfiles(profileIds: string[], biDirectional: boolean): Observable<BcPresenceResponse>
	{
		return this.convertToObservable(this.wrapper.presence.registerListenersForProfiles, profileIds, biDirectional);
	}

	getGroups(groupId: string, biDirectional: boolean): Observable<BcPresenceResponse>
	{
		return this.convertToObservable(this.wrapper.presence.registerListenersForGroup, groupId, biDirectional);
	}

	deregisterAllRTTCallbacks()
	{
		this.wrapper.rttService.deregisterAllRTTCallbacks();
	}

}
