import type { components } from '../../../schemas/generated-schema';
import type { UserStatus } from '../../backoffice/sections/users/user-extensions';
import { Entity } from '../mocks/data/entities';

export type PostInstallRequest = components['schemas']['InstallSetupRequest'];
export type StatusResponse = components['schemas']['StatusResponse'];
export type VersionResponse = components['schemas']['VersionResponse'];
export type ProblemDetails = components['schemas']['ProblemDetails'];
export type UserResponse = components['schemas']['UserResponse'];
export type AllowedSectionsResponse = components['schemas']['AllowedSectionsResponse'];
export type UmbracoInstaller = components['schemas']['InstallSettingsResponse'];
export type UmbracoUpgrader = components['schemas']['UpgradeSettingsResponse'];
export type ManifestsResponse = components['schemas']['ManifestsResponse'];
export type ManifestsPackagesInstalledResponse = components['schemas']['ManifestsPackagesInstalledResponse'];

// Models
export type UmbracoPerformInstallDatabaseConfiguration = components['schemas']['InstallSetupDatabaseConfiguration'];
export type UmbracoInstallerDatabaseModel = components['schemas']['InstallDatabaseModel'];
export type UmbracoInstallerUserModel = components['schemas']['InstallUserModel'];
export type TelemetryModel = components['schemas']['TelemetryModel'];
export type ServerStatus = components['schemas']['ServerStatus'];
export type ManifestTypes = components['schemas']['Manifest'];
export type ManifestSection = components['schemas']['IManifestSection'];
export type ManifestSectionView = components['schemas']['IManifestSectionView'];
export type ManifestTree = components['schemas']['IManifestTree'];
export type ManifestTreeItemAction = components['schemas']['IManifestTreeItemAction'];
export type ManifestEditor = components['schemas']['IManifestEditor'];
export type ManifestEditorAction = components['schemas']['IManifestEditorAction'];
export type ManifestPropertyEditorUI = components['schemas']['IManifestPropertyEditorUI'];
export type ManifestDashboard = components['schemas']['IManifestDashboard'];
export type ManifestEditorView = components['schemas']['IManifestEditorView'];
export type ManifestPropertyAction = components['schemas']['IManifestPropertyAction'];
export type ManifestEntrypoint = components['schemas']['IManifestEntrypoint'];
export type ManifestCustom = components['schemas']['IManifestCustom'];
export type ManifestPackageView = components['schemas']['IManifestPackageView'];
export type PackageInstalled = components['schemas']['PackageInstalled'];
export type ConsentLevelSettings = components['schemas']['ConsentLevelSettings'];

// Property Editors
export type PropertyEditorsListResponse = components['schemas']['PropertyEditorsListResponse'];
export type PropertyEditorResponse = components['schemas']['PropertyEditorResponse'];
export type PropertyEditorConfigResponse = components['schemas']['PropertyEditorConfigResponse'];
export type PropertyEditorConfig = components['schemas']['PropertyEditorConfig'];
export type PropertyEditor = components['schemas']['PropertyEditor'];
export type PropertyEditorConfigProperty = components['schemas']['PropertyEditorConfigProperty'];
export type PropertyEditorConfigDefaultData = components['schemas']['PropertyEditorConfigDefaultData'];

export type ManifestElementType =
	| ManifestSection
	| ManifestSectionView
	| ManifestTree
	| ManifestTreeItemAction
	| ManifestEditor
	| ManifestPropertyAction
	| ManifestPropertyEditorUI
	| ManifestDashboard
	| ManifestEditorView
	| ManifestEditorAction
	| ManifestPackageView;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HTMLElementConstructor<T = HTMLElement> = new (...args: any[]) => T;

// TODO: couldn't we make loader optional on all manifests? and not just the internal ones?
export type ManifestWithLoader<T> = T & { loader: () => Promise<object | HTMLElement> };

// Users
export interface UserEntity extends Entity {
	type: 'user';
}

export interface UserDetails extends UserEntity {
	email: string;
	status: UserStatus;
	language: string;
	lastLoginDate?: string;
	lastLockoutDate?: string;
	lastPasswordChangeDate?: string;
	updateDate: string;
	createDate: string;
	failedLoginAttempts: number;
	userGroups: Array<string>;
	contentStartNode?: string;
	mediaStartNode?: string;
}

export interface UserGroupEntity extends Entity {
	type: 'userGroup';
}

export interface UserGroupDetails extends UserGroupEntity {
	key: string;
	name: string;
	icon: string;
	sections: Array<string>;
	contentStartNode?: string;
	mediaStartNode?: string;
}
