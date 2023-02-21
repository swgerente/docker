import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { UUIMenuItemElement, UUIMenuItemEvent } from '@umbraco-ui/uui';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { UmbModalLayoutPickerBase } from '../../../../core/modal/layouts/modal-layout-picker-base';
import { UmbLanguageRepository } from '../repository/language.repository';
import { LanguageModel } from '@umbraco-cms/backend-api';

export interface UmbLanguagePickerModalData {
	multiple: boolean;
	selection: string[];
}

@customElement('umb-language-picker-modal-layout')
export class UmbLanguagePickerModalLayoutElement extends UmbModalLayoutPickerBase {
	static styles = [UUITextStyles, css``];

	@state()
	private _languages: Array<LanguageModel> = [];

	private _languageRepository = new UmbLanguageRepository(this);

	async firstUpdated() {
		const { data } = await this._languageRepository.requestLanguages();
		this._languages = data?.items ?? [];
	}

	#onSelection(event: UUIMenuItemEvent) {
		event?.stopPropagation();
		const language = event?.target as UUIMenuItemElement;
		const isoCode = language.dataset.isoCode;
		if (!isoCode) return;
		this.handleSelection(isoCode);
	}

	render() {
		return html`<umb-body-layout headline="Select languages">
			<uui-box>
				${repeat(
					this._languages,
					(item) => item.isoCode,
					(item) => html`
						<uui-menu-item
							label=${item.name ?? ''}
							selectable="true"
							@selected=${this.#onSelection}
							@unselected=${this.#onSelection}
							?selected=${this.isSelected(item.isoCode!)}
							data-iso-code="${ifDefined(item.isoCode)}">
							<uui-icon slot="icon" name="umb:globe"></uui-icon>
						</uui-menu-item>
					`
				)}
			</uui-box>
			<div slot="actions">
				<uui-button label="Close" @click=${this.close}></uui-button>
				<uui-button label="Submit" look="primary" color="positive" @click=${this.submit}></uui-button>
			</div>
		</umb-body-layout> `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-language-picker-modal-layout': UmbLanguagePickerModalLayoutElement;
	}
}
