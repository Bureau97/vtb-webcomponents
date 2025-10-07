import { LitElement } from 'lit';
import { InlineEditor } from 'ckeditor5';
export declare class VtbTextElement extends LitElement {
    static shadowRootOptions: {
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    protected isEditorInitialized: boolean;
    protected dataIsChanged: boolean;
    protected editor?: InlineEditor;
    protected _destroy_timer?: ReturnType<typeof setTimeout>;
    editable: boolean;
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