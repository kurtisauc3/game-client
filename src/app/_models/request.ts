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
	lobbyType: string;
	rating: number;
	otherUserCxIds: string[];
	settings: any;
	isReady: boolean;
	extraJson: any;
	teamCode: string;
	maxSteps: number;
	algo: {
		strategy: string;
		alignment: string;
		ranges: number[];
	};
	filterJson: {
		cheater?: boolean;
	}
}
