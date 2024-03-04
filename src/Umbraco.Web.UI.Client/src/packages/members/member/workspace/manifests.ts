import { UMB_MEMBER_ENTITY_TYPE } from '../entity.js';
import { UmbSaveWorkspaceAction } from '@umbraco-cms/backoffice/workspace';
import type { ManifestWorkspace, ManifestWorkspaceActions } from '@umbraco-cms/backoffice/extension-registry';

export const UMB_MEMBER_WORKSPACE_ALIAS = 'Umb.Workspace.Member';

const workspace: ManifestWorkspace = {
	type: 'workspace',
	alias: UMB_MEMBER_WORKSPACE_ALIAS,
	name: 'Member Workspace',
	js: () => import('./member-workspace.element.js'),
	meta: {
		entityType: UMB_MEMBER_ENTITY_TYPE,
	},
};

const workspaceActions: Array<ManifestWorkspaceActions> = [
	{
		type: 'workspaceAction',
		kind: 'default',
		alias: 'Umb.WorkspaceAction.Member.Save',
		name: 'Save Member Workspace Action',
		api: UmbSaveWorkspaceAction,
		meta: {
			label: 'Save',
			look: 'primary',
			color: 'positive',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: UMB_MEMBER_WORKSPACE_ALIAS,
			},
		],
	},
];

export const manifests = [workspace, ...workspaceActions];
