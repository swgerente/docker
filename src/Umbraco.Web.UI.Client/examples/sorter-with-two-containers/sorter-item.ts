import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, LitElement, state, repeat, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UmbSorterConfig, UmbSorterController } from '@umbraco-cms/backoffice/sorter';

@customElement('example-sorter-item')
export class ExampleSorterItem extends UmbElementMixin(LitElement) {
	@property({ type: String, reflect: true })
	name: string = '';

	@property({ type: Boolean, reflect: true, attribute: 'drag-placeholder' })
	umbDragPlaceholder = false;

	render() {
		return html`
			<div>
				${this.name}
				<img src="https://picsum.photos/seed/${this.name}/400/400" style="width:120px;" />
				<slot name="action"></slot>
			</div>
			<slot></slot>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				padding: var(--uui-size-layout-1);
				border: 1px solid var(--uui-color-border);
				border-radius: var(--uui-border-radius);
				margin-bottom: 3px;
			}
			:host([drag-placeholder]) {
				opacity: 0.2;
			}

			div {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			slot:not([name]) {
				// go on new line:
			}
		`,
	];
}

export default ExampleSorterItem;

declare global {
	interface HTMLElementTagNameMap {
		'example-sorter-item': ExampleSorterItem;
	}
}
