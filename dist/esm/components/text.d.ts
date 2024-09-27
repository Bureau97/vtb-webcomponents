import { LitElement } from 'lit';
import { InlineEditor } from 'ckeditor5';
export declare class VtbTextElement extends LitElement {
    static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    protected isEditorInitialized: Boolean;
    protected dataIsChanged: Boolean;
    protected editor?: InlineEditor;
    protected _destroy_timer?: ReturnType<typeof setTimeout>;
    editable: Boolean;
    contents: string | null;
    private get _editor();
    static styles: import("lit").CSSResult;
    constructor();
    createRenderRoot(): this;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    clickHandler(_e: Event): void;
    protected lostFocus(): void;
    protected _destroyEditor(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'vtb-text': VtbTextElement;
    }
}
//# sourceMappingURL=text.d.ts.map