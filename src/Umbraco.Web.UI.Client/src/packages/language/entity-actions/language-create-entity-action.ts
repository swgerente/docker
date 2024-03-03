import type { UmbEntityActionArgs } from '@umbraco-cms/backoffice/entity-action';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

export class UmbLanguageCreateEntityAction extends UmbEntityActionBase<UmbEntityActionArgs<never>> {
	constructor(host: UmbControllerHostElement, args: UmbEntityActionArgs<never>) {
		super(host, args);
	}

	async execute() {
		// TODO: Generate the href or retrieve it from something?
		history.pushState(null, '', `section/settings/workspace/language/create`);
	}

	destroy(): void {}
}
