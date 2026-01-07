import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

interface ISearchBody {
	query: string;
	source: string;
	limit: number;
	min_year?: number;
	max_year?: number;
}

export class RespSearch implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Resp Search',
		name: 'respSearch',
		icon: { light: 'file:resp.svg', dark: 'file:resp.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Search for papers using the Resp Python backend',
		defaults: {
			name: 'Resp Search',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'respApi',
				required: true,
			},
		],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				placeholder: 'Search term',
				description: 'The search query',
				required: true,
			},
			{
				displayName: 'Source',
				name: 'source',
				type: 'options',
				options: [
					{
						name: 'All',
						value: 'all',
					},
					{
						name: 'ACM',
						value: 'acm',
					},
					{
						name: 'Arxiv',
						value: 'arxiv',
					},
					{
						name: 'Google Scholar',
						value: 'google_scholar',
					},
					{
						name: 'Semantic Scholar',
						value: 'semantic_scholar',
					},
				],
				default: 'all',
				description: 'The source to search from',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'nu1900,
				description: 'Minimum year filter',
			},
			{
				displayName: 'Max Year',
				name: 'maxYear',
				type: 'number',
				default: 2026er',
				default: '',
				description: 'Minimum year filter',
			},
			{
				displayName: 'Max Year',
				name: 'maxYear',
				type: 'number',
				default: '',
				description: 'Maximum year filter',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const promises: Array<Promise<INodeExecutionData[]>> = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			promises.push(
				(async () => {
					try {
						const credentials = await this.getCredentials('respApi');
						const baseUrl = credentials.baseUrl as string;
						const query = this.getNodeParameter('query', itemIndex, '') as string;
						const source = this.getNodeParameter('source', itemIndex, 'all') as string;
						const limit = this.getNodeParameter('limit', itemIndex, 5) as number;
						const minYear = this.getNodeParameter('minYear', itemIndex, undefined) as
							| number
							| undefined;
						const maxYear = this.getNodeParameter('maxYear', itemIndex, undefined) as
							| number
							| undefined;

						if (minYear !== undefined && maxYear !== undefined && minYear > maxYear) {
							throw new NodeOperationError(
								this.getNode(),
								`Min Year (${minYear}) cannot be greater than Max Year (${maxYear})`,
								{ itemIndex },
							);
						}

						const body: ISearchBody = {
							query,
							source,
							limit,
						};

						if (minYear !== undefined) body.min_year = minYear;
						if (maxYear !== undefined) body.max_year = maxYear;

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/search`,
							body,
							json: true,
						});

						// Flatten output: If response is an array, return multiple items
						const results = Array.isArray(response) ? response : [response];

						return results.map((item: any) => ({
							json: item,
							pairedItem: {
								item: itemIndex,
							},
						}));
					} catch (error) {
						if (this.continueOnFail()) {
							return [
								{
									json: { error: error.message },
									pairedItem: { item: itemIndex },
								},
							];
						} else {
							if (error.context) {
								error.context.itemIndex = itemIndex;
								throw error;
							}
							throw new NodeOperationError(this.getNode(), error, {
								itemIndex,
							});
						}
					}
				})(),
			);
		}

		// Wait for all promises to resolve
		const results = await Promise.all(promises);
		results.forEach((executionData) => returnData.push(...executionData));

		return [returnData];
	}
}
