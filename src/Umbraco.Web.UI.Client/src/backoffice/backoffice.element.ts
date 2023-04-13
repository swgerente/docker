import { defineElement } from '@umbraco-ui/uui-base/lib/registration';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import {
	UmbBackofficeContext,
	UMB_BACKOFFICE_CONTEXT_TOKEN,
} from './shared/components/backoffice-frame/backoffice.context';
import { UmbServerExtensionController } from './packages/repository/server-extension.controller';
import { createExtensionClass, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/modal';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';
import { UmbEntryPointExtensionInitializer } from '@umbraco-cms/backoffice/extensions-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

// Domains
const CORE_PACKAGES = [
	import('./shared/umbraco-package'),
	import('./settings/umbraco-package'),
	import('./documents/umbraco-package'),
	import('./media/umbraco-package'),
	import('./members/umbraco-package'),
	import('./translation/umbraco-package'),
	import('./users/umbraco-package'),
	import('./packages/umbraco-package'),
	import('./search/umbraco-package'),
	import('./templating/umbraco-package'),
];

@defineElement('umb-backoffice')
export class UmbBackofficeElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				height: 100%;
				width: 100%;
				color: var(--uui-color-text);
				font-size: 14px;
				box-sizing: border-box;
			}
			umb-backoffice-modal-container {
				z-index: 1000;
			}
		`,
	];

	#storeMap = new Map();

	constructor() {
		super();

		this.#loadCorePackages();
		this.provideContext(UMB_MODAL_CONTEXT_TOKEN, new UmbModalContext(this));
		this.provideContext(UMB_NOTIFICATION_CONTEXT_TOKEN, new UmbNotificationContext());
		this.provideContext(UMB_BACKOFFICE_CONTEXT_TOKEN, new UmbBackofficeContext());
		new UmbEntryPointExtensionInitializer(this, umbExtensionsRegistry);
		new UmbServerExtensionController(this, umbExtensionsRegistry);

		// Register All Stores
		// TODO: we have a performance issue here. Temp fix is to cache in a map so we don't create new instances of already known stores every time a new extension is registered
		this.observe(umbExtensionsRegistry.extensionsOfTypes(['store', 'treeStore']), (stores) => {
			if (!stores) return;
			stores.forEach((store) => {
				if (this.#storeMap.has(store.alias)) return;
				this.#storeMap.set(store.alias, createExtensionClass(store, [this]));
			});
		});
	}

	// TODO: temp solution. These packages should show up in the package section, so they need to go through the extension controller
	async #loadCorePackages() {
		CORE_PACKAGES.forEach(async (packageImport) => {
			const packageModule = await packageImport;
			const extensions = packageModule.extensions;
			const entryPointLoaders = extensions.map((extension) => extension.type === 'entryPoint' && extension.loader);

			entryPointLoaders.forEach((loader) => {
				if (!loader) return;

				loader().then((entryPointModule) => {
					entryPointModule.onInit(this, umbExtensionsRegistry);
				});
			});
		});
	}

	render() {
		return html`
			<umb-backoffice-header></umb-backoffice-header>
			<umb-backoffice-main></umb-backoffice-main>
			<umb-backoffice-notification-container></umb-backoffice-notification-container>
			<umb-backoffice-modal-container></umb-backoffice-modal-container>
		`;
	}
}

export default UmbBackofficeElement;
declare global {
	interface HTMLElementTagNameMap {
		'umb-backoffice': UmbBackofficeElement;
	}
}
