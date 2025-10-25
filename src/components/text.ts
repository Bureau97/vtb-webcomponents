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
import Quill, { QuillOptions } from 'quill';
import "quill/dist/quill.core.css";
// import {unsafeHTML} from 'lit/directives/unsafe-html.js';
// import {styleMap, StyleInfo} from 'lit/directives/style-map.js';




export enum EditorType {
  SIMPLE = 'simple',
  HTML = 'html'
}


@customElement('vtb-text')
export class VtbTextElement extends LitElement {

  // static override shadowRootOptions = {
  //   ...LitElement.shadowRootOptions,
  //   delegatesFocus: true
  // };

  protected isEditorInitialized: boolean = false;
  protected dataIsChanged: boolean = false;
  // protected editor?: InlineEditor = undefined;
  protected _destroy_timer?: ReturnType<typeof setTimeout>;

  @property({type: Boolean})
  editable: boolean = false;

  // @property({
  //   type: String,
  //   attribute: false,
  //   hasChanged(newVal: string, oldVal: string): boolean {
  //     return newVal !== oldVal;
  //   }
  // })
  // contents: string = '';

  @property({type: String, attribute: 'objectid'})
  object_id: string = '';

  @property({ type: String, attribute: 'property-name' })
  property_name: string = '';

  @property({ type: String, attribute: 'editor-type' })
  editor_type : string = EditorType.SIMPLE;

  private get _editor(): HTMLElement | null {
    console.debug(
      '[VtbText:_editor] editor: ',
      this.renderRoot.querySelector('div#editor-' + this.id)
    );
    return this.renderRoot.querySelector('div#editor-' + this.id);
  }

  static override styles = css`
    :host {
      display: inline-block;
      margin: 0;
      padding: 0;
    }

    .main-container {
      font-family: var(--ck-content-font-family);
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }

    .editor-container_inline-editor .editor-container__editor {
      min-width: 795px;
      max-width: 795px;
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

    // copy innerHTML to the contents property
    // this.contents = this.innerHTML.trim();

    // remove all childNodes and add them
    // to the editor container
    // let childToDelete = this.lastChild;
    // while (childToDelete) {
    //   this.removeChild(childToDelete);
    //   childToDelete = this.lastChild;
    // }
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
      <div id="editor-container-${this.id}" @click=${this.clickHandler}>
        <slot></slot>
        <div id="editor-${this.id}"></div>
      </div>
    `;
  }

  protected _initHtmlEditor() {
    console.info('init html editor')

    const editorContainer = this._editor

    if (!editorContainer) {
      return
    }

    const slottedElements = this.shadowRoot?.querySelector('slot')?.assignedElements()
    console.info(slottedElements)

    if (!slottedElements || slottedElements.length <= 0) {
      return
    }

    // copy slotted elements to editor container
    slottedElements.forEach((el) => {
      editorContainer.appendChild(el)
    })

    const options: QuillOptions = {
      debug: 'info',
      modules: {
        toolbar: true,
      },
      theme: 'snow'
    };
    
    const quill = new Quill(editorContainer, options);
    console.info(quill)

    
    // quill.setContents(slottedElements)

  }

  protected _initSimpleEditor() {
    // console.info(this._editor)
    console.info('init simple editor')
  }

  private clickHandler(e: Event) {
    console.debug('vtbtext:clickHandler: ', e);
    console.info(this._editor)

    // console.debug('check innerHTML and content: ', {
    //   innerHTML: this.innerHTML,
    //   contents: this.contents,
    //   'same?': this.innerHTML == this.contents
    // });

    if (this.isEditorInitialized && this._destroy_timer) {
      // console.debug('clear editor destruction timer');
      clearTimeout(this._destroy_timer);
      this._destroy_timer = undefined;
    }

    if (this.editable && !this.isEditorInitialized) {
      console.debug('[clickHandler] initializing editor');

      if (!this._editor) {
        console.warn('[clickHandler] not initializing the editor, editor is null');
        return;
      }

      // set the inialized bit..
      this.isEditorInitialized = true;

      if (this.editor_type == EditorType.HTML) {
        console.info('[clickHandler] initializing html editor')
        this._initHtmlEditor();
      }
      else if (this.editor_type == EditorType.SIMPLE) {
        console.info('[clickHandler] initialize simple editor')
        this._initSimpleEditor();
      }

    }
  }

  protected lostFocus() {
    console.debug('vtbtext:lostFocus');

    // if (!this.editor) {
    //   console.debug('no editor (yet)');
    //   return;
    // }

    // console.debug('changed data: ', this.editor.getData());

    // dispatch custom event
    // const changed_content = this.editor.getData();
    const changed_content = 'Whazaa'
    const event = new CustomEvent('vtbTextChanged', {
      detail: {
        content: changed_content
      },
      bubbles: true
    });
    console.debug('dispatching change event: ');
    this.dispatchEvent(event);

    // schedule destroying the editor after losing focus
    // console.debug('schedule destroy');
    const destroy = this._destroyEditor.bind(this);
    this._destroy_timer = setTimeout(destroy, 3000);

    // }
  }

  protected _destroyEditor() {
    console.debug('destroying editor..');
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
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-text': VtbTextElement;
  }
}
