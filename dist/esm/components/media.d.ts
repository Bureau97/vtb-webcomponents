import { LitElement } from 'lit';
export declare class VtbMediaElement extends LitElement {
    src: string;
    width: number;
    height: number;
    crop?: string;
    alt?: string;
    static styles: import("lit").CSSResult;
    private _imageStyles;
    private _applyCrop;
    render(): "" | import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'vtb-media': VtbMediaElement;
    }
}
//# sourceMappingURL=media.d.ts.map