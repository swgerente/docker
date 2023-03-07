import { html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, query } from 'lit/decorators.js';
import { Observable } from 'rxjs';
import { when } from 'lit-html/directives/when.js';
import { UmbModalLayoutElement } from 'libs/modal';

export interface UmbCreateDictionaryModalData {
	unique: string | null;
	parentName: Observable<string | undefined>;
}

export interface UmbCreateDictionaryModalResultData {
	name?: string;
}

@customElement('umb-create-dictionary-modal-layout')
export class UmbCreateDictionaryModalLayoutElement extends UmbModalLayoutElement<UmbCreateDictionaryModalData> {
	static styles = [UUITextStyles];

	@query('#form')
	private _form!: HTMLFormElement;

	#parentName?: string;

	connectedCallback() {
		super.connectedCallback();

		if (this.data?.parentName) {
			this.observe(this.data.parentName, (value) => (this.#parentName = value));
		}
	}

	#handleCancel() {
		this.modalHandler?.close({});
	}

	#submitForm() {
		this._form?.requestSubmit();
	}

	async #handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (!form || !form.checkValidity()) return;

		const formData = new FormData(form);

		this.modalHandler?.close({
			name: formData.get('name') as string,
		});
	}

	render() {
		return html` <umb-body-layout headline="Create">
			${when(this.#parentName, () => html`<p>Create a dictionary item under <b>${this.#parentName}</b></p>`)}
			<uui-form>
				<form id="form" name="form" @submit=${this.#handleSubmit}>
					<uui-form-layout-item>
						<uui-label for="nameinput" slot="label" required>Name</uui-label>
						<div>
							<uui-input
								type="text"
								id="nameinput"
								name="name"
								label="name"
								required
								required-message="Name is required"></uui-input>
						</div>
					</uui-form-layout-item>
				</form>
			</uui-form>
			<uui-button slot="actions" type="button" label="Close" @click=${this.#handleCancel}></uui-button>
			<uui-button slot="actions" type="button" label="Create" look="primary" @click=${this.#submitForm}></uui-button>
		</umb-body-layout>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-create-dictionary-modal-layout': UmbCreateDictionaryModalLayoutElement;
	}
}
