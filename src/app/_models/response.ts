import { HTTP_STATUS, BC_REASON_CODE } from './status';

export class BcResponse
{
	status: HTTP_STATUS;
	reason_code?: BC_REASON_CODE;
	status_message?: string;
	data?: any;
}
export class BcAuthenticateResponse
{
	playerName: string;
	emailAddress: string;
	profileId: string;
	incoming_events: BcEvent[];
}
export class BcRTTResponse
{
	service: string;
    operation: string
}
export class BcPresence
{
	user: {
		name: string;
		id: string;
	};
	online: boolean;
}
export class BcRttMessage
{
	message: {
		content: {
			text: string
		};
		from: {
			id: string;
			name: string;
		};
		to: string[];
	};
	msgId: string;
	msgbox: "inbox" | "sent";
}
export class BcMessage extends BcRttMessage
{
	read: boolean;
}
export class BcPresenceResponse
{
	presence: BcPresence[];
}
export class BcFriendsEntities
{
	userId: string;
	entities: BcEntity[];
}
export class BcFriendsEntitiesResponse
{
	results: BcFriendsEntities[];
}
export class BcMessagesPageResponse
{
	context: string;
	results: {
		count: number;
		page: number;
		items: BcMessage[];
		moreAfter: boolean;
		moreBefore: boolean;
	}
}
export class BcEventsResponse
{
	incoming_events: BcEvent[];
}
export class BcEvent
{
	createdAt: number;
	evId: string;
	eventData: any;
	eventType: string;
	fromPlayerId: string;
	gameId: string;
	toPlayerId: string;
}
export class BcEventResponse extends BcRTTResponse
{
	data: BcEvent;
}
export class BcChat
{
	//todo
}
export class BcChatResponse
{
	data: BcChat;
}
export class BcLobby
{
	//todo
}
export class BcRttLobby
{
	//todo
}
export class BcLobbyResponse
{
	data: BcLobby;
}
export class BcMessaging
{

}
export class BcMessagingResponse
{
	data: BcMessaging;
}
export class FriendProfile
{
	pictureUrl: any;
	profileId: string;
	profileName: string;
	summaryFriendData: any;
}
export class FindFriendResponse
{
	matchedCount: number;
	matches: FriendProfile[];
}
export class BcGroupResponse
{
	requested: any[];
	invited: any[];
	groups: BcGroup[];
}
export class BcGroup
{
	groupType: string;
	groupId: string;
	isOpenGroup: boolean;
	requestingPendingMemberCount: number;
	invitedPendingMemberCount: number;
	ownerId: string;
	name: string;
	memberCount: number;
}
export class CreateGroupResponse
{
	groupId: string;
	ownerId: string;
	//TODO add other props
}

export class BcEntity
{
		entityId: string;
		entityType: string;
		version: number;
		data: any;
		acl: {
			other: number;
		};
		createdAt: number;
		updatedAt: number;

}
export class EntityResponse
{
	entities: BcEntity[];
	entityListCount: number;
}
export class BcFindPlayer
{
	profileName: string;
	profileId: string;
	pictureUrl: string;
	summaryFriendData: any;
}
export class BcMatchPlayer
{
	playerId: string;
	playerName: string;
	pictureUrl: any;
}
export class BcFindUsersByNameResponse
{
	matchedCount: number;
	message: string;
	matches: BcFindPlayer[];
}
export class BcMatchStatus
{
	status: string;
	currentPlayer: string;
}
export class BcMatch
{
	gameId: string;
	ownerId: string;
	matchId: string;
	version: number;
	players: BcMatchPlayer[];
	status: BcMatchStatus;
	summary: any;
	createdAt: number;
	updatedAt: number;
}
export class BcMatchResponse
{
	results: BcMatch[];
}

