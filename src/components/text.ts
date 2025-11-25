/**
 *
 * Copyright 2024 Huub Segers - B97
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
// import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import tinymce, { Editor } from 'tinymce';
import 'tinymce/icons/default/icons.min.js';

/* Required TinyMCE components */
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';

/* Import a skin (can be a custom skin instead of the default) */
// import 'tinymce/skins/ui/oxide/skin.js';

/* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';


/* content UI CSS is required */
// import contentUiSkinCss from 'tinymce/skins/ui/oxide/content.js';

/* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
// import contentCss from 'tinymce/skins/content/default/content.js';

// import { Editor } from '@tinymce/tinymce-webcomponent';


export enum EditorType {
  SIMPLE = 'simple',
  HTML = 'html'
}



@customElement('vtb-text')
export class VtbTextElement extends LitElement {

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  @property({type: Boolean})
  editable: boolean = false;

  @property({
    type: String,
    attribute: false,
    hasChanged(newVal: string, oldVal: string): boolean {
      return newVal !== oldVal;
    }
  })
  contents: string = '';

  @property({type: String})
  objectId: string = '';

  @property({ type: String })
  propertyName: string = '';

  @property({ type: String, attribute: 'editor-type' })
  editorType : string = EditorType.SIMPLE;


  static override styles = css`
    :host {
      display: inline-block;
      margin: 0;
      padding: 0;
    }
  `;

  constructor() {
    super();
    console.debug('vtbtext:constructor');
    // create an id for the editor when no id is defined
    // this makes sure no conflicts can occur when
    // having multiple editors active at the same time
    if (!this.id) {
      this.id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }
  }

  // override createRenderRoot() {
  //   // ckEditor does not work in the shadow dom
  //   // it'll throw an error as soon as you try to
  //   // type anything in the editor.
  //   // the main error is coming from @ckeditor/ckeditor5-utils/src/dom/getborderwidths
  //   console.debug('vtbtext:createRenderRoot');
  //   return this;
  // }

  override connectedCallback() {
    console.debug('vtbtext:connectedCallback');
    super.connectedCallback();

  //   // copy innerHTML to the contents property
  //   // this.contents = this.innerHTML.trim();

  //   // remove all childNodes and add them
  //   // to the editor container
  //   let childToDelete = this.lastChild;
  //   while (childToDelete) {
  //     this.removeChild(childToDelete);
  //     childToDelete = this.lastChild;
  //   }
  }

  private _loadRichEditorCss() {
    if (this.editorType == EditorType.HTML) {
      // return html`<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">`
    }
    return html``
  }

  override render() {
    console.debug('vtbtext:render');

    // TODO: check if innerHTML and content are the same,
    // if not copy contents to innerHTML
    // console.debug('check innerHTML and content: ', {
    //   'innerHTML': this.innerHTML,
    //   'contents': this.contents,
    //   'same?': boolean(this.innerHTML == this.contents)
    // });

    // if (this.innerHTML != this.contents) {
    //   console.debug('copy contents to innerHTML');
    //   this.innerHTML = this.contents;
    // }

    // nothing fancy to render..
    return html`
      ${this._loadRichEditorCss()}

      <div id="editor-container-${this.id}" @click=${this.clickHandler}>
        <div id="editor-${this.id}"></div>
        <slot></slot>
      </div>
    `;
  }

  // private get _editor(): HTMLElement | null {
  //   console.debug(
  //     'editor: ',
  //     this.renderRoot.querySelector('div#editor-' + this.id)
  //   );
  //   return this.renderRoot.querySelector('div#editor-' + this.id);
  // }

  private get _editorContainer(): HTMLElement | null {
    console.debug(
      'editorContainer: ',
      this.renderRoot.querySelector('div#editor-' + this.id)
    );

    return this.renderRoot.querySelector('div#editor-' + this.id);
  }


  private get _slottedInnerHTML(): string {
    const slottedContents = this.renderRoot.querySelector('slot')?.assignedElements({
      flatten: true
    });

    let slottedHtmlContents = '';
    for (const slottedElement of slottedContents || []) {
      slottedHtmlContents += slottedElement.outerHTML;
    }

    return slottedHtmlContents;
  }


  private _editor: Editor | null = null;  // @ts-ignore

  clickHandler(_e: Event) {
    console.debug('vtbtext:clickHandler: ', _e);

    if (!this._editor && this.editorType == EditorType.HTML) {
      console.log(`initialize editor on ${this.id}`)

      const editorContainer = this._editorContainer;

      if (!editorContainer) {
        console.error('no editor container found');
        return;
      }

      tinymce.init({
        target: editorContainer,
        toolbar: "undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        license_key: 'gpl',
        skin_url: 'default',
        content_css: 'default',
      }).then((editor) => {
        this._editor = editor[0]; // should be only one editor
      })

      // this._editor = new Quill(editorContainer as HTMLElement, {
      //   'theme': 'snow',
      // }) as Quill;

      // const delta = this._editor.clipboard.convert({html: this._slottedInnerHTML});
      // this._editor.setContents(delta, 'api');

      // this._editor.clipboard.dangerouslyPasteHTML(this._slottedInnerHTML);
      // this._editor.setText(this._slottedInnerHTML, 'api');
      console.info(this._slottedInnerHTML);


    }

    if (!this._editor && this.editorType == EditorType.SIMPLE) {
      console.info('setup simple editor');
    }
  }

  // protected override update(changedProperties: PropertyValues): void {
  //   console.debug('vtbtext:update');
  //   super.update(changedProperties);
  // }

  // protected lostFocus() {
  //   console.debug('vtbtext:lostFocus');

  //   if (!this.editor) {
  //     console.debug('no editor (yet)');
  //     return;
  //   }

  //   console.debug('changed data: ', this.editor.getData());

  //   // dispatch custom event
  //   const changed_content = this.editor.getData();
  //   const event = new CustomEvent('vtbTextChanged', {
  //     detail: {
  //       content: changed_content
  //     },
  //     bubbles: true
  //   });
  //   console.debug('dispatching change event: ');
  //   this.dispatchEvent(event);

  //   // schedule destroying the editor after losing focus
  //   // console.debug('schedule destroy');
  //   const destroy = this._destroyEditor.bind(this);
  //   this._destroy_timer = setTimeout(destroy, 3000);

  //   // }
  // }

  // protected _destroyEditor() {
  //   console.debug('destroying editor..');
  //   if (this.editor) {
  //     // const changed_content = this.editor.getData();

  //     // this._editor.style.display = 'none';

  //     this.editor.destroy();
  //     this.isEditorInitialized = false;
  //     delete this.editor;

  //     // if (this._editor){
  //     //   console.debug('set innerHTML: ', changed_content);
  //     //   this._editor.innerHTML = changed_content;
  //     // }
  //   }
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-text': VtbTextElement;
  }
}
