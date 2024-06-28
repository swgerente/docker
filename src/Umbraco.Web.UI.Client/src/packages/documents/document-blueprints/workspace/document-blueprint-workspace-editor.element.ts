import { customElement, state, css, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbRoute, UmbRouterSlotInitEvent } from '@umbraco-cms/backoffice/router';
import type { UmbDocumentBlueprintVariantOptionModel } from '../types.js';
import { UMB_DOCUMENT_BLUEPRINT_WORKSPACE_CONTEXT } from './document-blueprint-workspace.context-token.js';
import { UmbDocumentBlueprintWorkspaceSplitViewElement } from './document-blueprint-workspace-split-view.element.js';

@customElement('umb-document-blueprint-workspace-editor')
export class UmbDocumentBlueprintWorkspaceEditorElement extends UmbLitElement {

	#workspaceContext?: typeof UMB_DOCUMENT_BLUEPRINT_WORKSPACE_CONTEXT.TYPE;

	@state()
	_routes?: Array<UmbRoute>;

	constructor() {
		super();
		this.consumeContext(UMB_DOCUMENT_BLUEPRINT_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance;
			this.#observeVariants();
		});
	}

	#observeVariants() {
		if (!this.#workspaceContext) return;
		this.observe(this.#workspaceContext.variantOptions, (options) => this._generateRoutes(options), '_observeVariants');
	}

	private _handleVariantFolderPart(index: number, folderPart: string) {
		const variantSplit = folderPart.split('_');
		const culture = variantSplit[0];
		const segment = variantSplit[1];
		this.#workspaceContext?.splitView.setActiveVariant(index, culture, segment);
	}

	private async _generateRoutes(variants: Array<UmbDocumentBlueprintVariantOptionModel>) {
		if (!variants || variants.length === 0) return;

		// Generate split view routes for all available routes
		const routes: Array<UmbRoute> = [];

		// Split view routes:
		variants.forEach((variantA) => {
			variants.forEach((variantB) => {
				routes.push({
					// TODO: When implementing Segments, be aware if using the unique is URL Safe... [NL]
					path: variantA.unique + '_&_' + variantB.unique,
					component: UmbDocumentBlueprintWorkspaceSplitViewElement,
					setup: (_component, info) => {
						// Set split view/active info..
						const variantSplit = info.match.fragments.consumed.split('_&_');
						variantSplit.forEach((part, index) => {
							this._handleVariantFolderPart(index, part);
						});
					},
				});
			});
		});

		// Single view:
		variants.forEach((variant) => {
			routes.push({
				// TODO: When implementing Segments, be aware if using the unique is URL Safe... [NL]
				path: variant.unique,
				component: UmbDocumentBlueprintWorkspaceSplitViewElement,
				setup: (_component, info) => {
					// cause we might come from a split-view, we need to reset index 1.
					this.#workspaceContext?.splitView.removeActiveVariant(1);
					this._handleVariantFolderPart(0, info.match.fragments.consumed);
				},
			});
		});

		if (routes.length !== 0) {
			// Using first single view as the default route for now (hence the math below):
			routes.push({
				path: '',
				redirectTo: routes[variants.length * variants.length]?.path,
			});
		}

		routes.push({
			path: `**`,
			component: async () => (await import('@umbraco-cms/backoffice/router')).UmbRouteNotFoundElement,
		});

		const oldValue = this._routes;

		// is there any differences in the amount ot the paths? [NL]
		// TODO: if we make a memorization function as the observer, we can avoid this check and avoid the whole build of routes. [NL]
		if (oldValue && oldValue.length === routes.length) {
			// is there any differences in the paths? [NL]
			const hasDifferences = oldValue.some((route, index) => route.path !== routes[index].path);
			if (!hasDifferences) return;
		}
		this._routes = routes;
		this.requestUpdate('_routes', oldValue);
	}

	private _gotWorkspaceRoute = (e: UmbRouterSlotInitEvent) => {
		this.#workspaceContext?.splitView.setWorkspaceRoute(e.target.absoluteRouterPath);
	};

	override render() {
		return this._routes
			? html`<umb-router-slot .routes=${this._routes} @init=${this._gotWorkspaceRoute}></umb-router-slot>`
			: '';
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	];
}

export default UmbDocumentBlueprintWorkspaceEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-blueprint-workspace-editor': UmbDocumentBlueprintWorkspaceEditorElement;
	}
}
