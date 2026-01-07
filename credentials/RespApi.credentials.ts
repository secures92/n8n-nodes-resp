import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RespApi implements ICredentialType {
	name = 'respApi';

	displayName = 'Resp API';

	icon = 'file:../nodes/RespSearch/resp.svg';

	documentationUrl = 'https://github.com/secures92/n8n-nodes-resp';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'http://localhost:5000',
			description: 'The URL of the Resp Search Backend',
		},
	];
}
