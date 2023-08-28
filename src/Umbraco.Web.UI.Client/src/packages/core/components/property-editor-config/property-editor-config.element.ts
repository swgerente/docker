import { UMB_DATA_TYPE_WORKSPACE_CONTEXT } from '../../../settings/data-types/workspace/data-type-workspace.context.js';
import { html, customElement, property, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import {
	PropertyEditorConfigProperty,
} from '@umbraco-cms/backoffice/extension-registry';

import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbInvariantDatasetContext } from '@umbraco-cms/backoffice/data-type';

/**
 *  @element umb-property-editor-config
 *  @description - Element for displaying the configuration for a Property Editor based on a Property Editor UI Alias and a Property Editor Model alias.
 */
@customElement('umb-property-editor-config')
export class UmbPropertyEditorConfigElement extends UmbLitElement {

	#datasetContext?: UmbInvariantDatasetContext;

	/**
	 * Data. The element will render configuration editors with values from this data.
	 * If a value is not found in this data, the element will use the default value from the configuration.
	 * @type {Array<{ alias: string; value: unknown }>}
	 * @attr
	 * @default []
	 */
	@property({ type: Array })
	public data: Array<{ alias: string; value: unknown }> = [];

	@state()
	private _properties: Array<PropertyEditorConfigProperty> = [];


	constructor() {
		super();

		this.consumeContext(UMB_DATA_TYPE_WORKSPACE_CONTEXT, (instance) => {
			console.log("config got context, but has already?...", this.#datasetContext)
			this.#datasetContext = instance.createDatasetContext(this);
			this.observe(this.#datasetContext.properties, (properties) => {
				this._properties = properties as Array<PropertyEditorConfigProperty>;
			}, 'observeProperties');
		});

	}

	/**
	 * Get the stored value for a property. It will render the default value from the configuration if no value is stored in the database.
	 */
	// TODO: Refactor: setup a dataset for this, otherwise we cannot ensure features, neither the right reactivity.
	// TODO: Refactor: move the default data and getting the property config etc. to the workspace.
	/**
	Create a dataset context for this one. Feed if with fallback/default values.
	 */

	render() {
		return html`
			${this._properties.length > 0
				? html`
						${this._properties?.map(
							(property) => html`
								<umb-workspace-property
									label="${property.label}"
									description="${ifDefined(property.description)}"
									alias="${property.alias}"
									property-editor-ui-alias="${property.propertyEditorUiAlias}"
									.config=${property.config}></umb-workspace-property>
							`
						)}
				  `
				: html`<div>No configuration</div>`}
		`;
	}

	static styles = [UUITextStyles];
}

export default UmbPropertyEditorConfigElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-config': UmbPropertyEditorConfigElement;
	}
}
