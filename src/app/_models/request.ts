import { LobbyMode, LobbyType, LoginType, TeamCode } from './enum';
export class LoginRequest
{
	userName?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}
export class SendFriendRequest
{
	userName: string;
}
export class BcSendFriendRequestRequest
{
	profileId: string;
}
export class BcMessagingContext
{
	pagination?: {
		rowsPerPage: number;
		pageNumber: number;
	};
	searchCriteria?: any;
	sortCriteria?: {
			mbCr: number;
	}
}
export class CreateLobbyRequest
{
	lobbyType: LobbyType;
	rating: number;
	otherUserCxIds: string[];
	settings: {
		lobbyMode: LobbyMode
	};
	isReady: boolean;
	extraJson: any;
	teamCode: TeamCode;
}