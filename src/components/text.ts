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

import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';


// import {styleMap, StyleInfo} from 'lit/directives/style-map.js';

import {
  InlineEditor,
  // Alignment,
  Autosave,
  Bold,
  Essentials,
  // FontBackgroundColor,
  // FontColor,
  // FontFamily,
  // FontSize,
  // Heading,
  // Highlight,
  // HorizontalLine,
  // Indent,
  // IndentBlock,
  Italic,
  // Link,
  List,
  Paragraph,
  // PasteFromOffice,
  // RemoveFormat,
  // Strikethrough,
  // Subscript,
  // Superscript,
  // Underline
} from 'ckeditor5';

import type { EditorConfig } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

// class VtbTextSaveCommand extends Command {
//   override execute() {
//     console.info('VtbTextSaveCommand:execute');
//     // console.info(this.editor);
//   }
// }

// class VtbTextCommandsPlugin extends Plugin {
//   init() {
//     const editor = this.editor;
//     editor.commands.add('save', new VtbTextSaveCommand(editor));
//   }
// }

// class VtbTextCommandUI extends Plugin {
//   init () {
//     const editor = this.editor;
//     editor.ui.componentFactory.add('save', locale => {
//       return {

//       })
//   }
// }

// function VtbTextSave(editor: Editor) {
//   // console.info('VtbTextSave registerd');
//   // editor.commands.add('save', new VtbTextSaveCommand(editor));
//   editor.ui.componentFactory.add('save', (locale) => {
//     const button = new ButtonView(locale);
//     // const command = editor.commands.get('save');
//     const t = editor.t;

//     button.set({
//       label: t('Save'),
//       withText: true,
//       tooltip: true,
//       isToggleable: true
//     });

//     button.on('execute', () => {
//       editor.execute('save');
//       editor.editing.view.focus();
//     });

//     // button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

//     return button;
//   });
// }


export enum EditorType {
  SIMPLE = 'simple',
  HTML = 'html'
}


class _SimpleTextEditor extends EventTarget {
  protected placeholder: HTMLElement | null = null
  // private oldValue: string = ''

  constructor() {
    super()
  }

  create (placeholder: HTMLElement) : _SimpleTextEditor | undefined {

    if (!placeholder) {
      console.warn('[SimpleTextEditor] no placeholder provided!');
      return
    }

    this.placeholder = placeholder
    // this.oldValue = placeholder.textContent
    this.placeholder.contentEditable = 'true'
    this.focus()

    this.placeholder.addEventListener('blur', () => {
      console.info('[SimpleTextEditor] lost focus', new Date());

      this.dispatchEvent(new Event('lostFocus'))
    });

    return this
  }

  // on(event: string, callback: Function) {
  //   // this.placeholder?.addEventListener(event: Event, callback)

  // }

  // override addEventListener(event: string, listener: EventListenerOrEventListenerObject) {
  //   return this.placeholder?.addEventListener(event, listener)
  // }

  focus() {
    console.info('[SimpleTextEditor] activate focus');
    this.placeholder?.focus()
  }

  getData() {
    console.info('[SimpleTextEditor] return data');
    return this.placeholder?.textContent
  }

  destroy() {
    console.info('[SimpleTextEditor] destroy');
    if (this.placeholder) {
      // this.placeholder.textContent =
      this.placeholder.contentEditable = 'false'
      this.placeholder = null
    }
  }
}

// create singleton
const SimpleTextEditor = new _SimpleTextEditor



@customElement('vtb-text')
export class VtbTextElement extends LitElement {
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  protected isEditorInitialized: boolean = false;
  protected dataIsChanged: boolean = false;
  protected editor?: InlineEditor | _SimpleTextEditor = undefined;
  protected _destroy_timer?: ReturnType<typeof setTimeout>;

  protected LICENSE_KEY = 'GPL';
  protected editorConfig: EditorConfig = {
    root: {
      placeholder: 'Type or paste your content here!',
      initialData: 'initial data'
    },
    toolbar: {
      items: ['undo', 'redo', '|', 'bold', 'italic', '|', 'list'],
      shouldNotGroupWhenFull: false
    },
    plugins: [Autosave, Bold, Essentials, Italic, Paragraph, List],
    licenseKey: this.LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
    },
    updateSourceElementOnDestroy: true
  };

  @property({ type: Boolean })
  editable: boolean = false;

  @property({
    type: String,
    attribute: false,
    hasChanged(newVal: string, oldVal: string): boolean {
      return newVal !== oldVal;
    }
  })
  contents: string = '';

  @property({ type: String, attribute: 'object-id' })
  objectId: string = '';

  @property({ type: String, attribute:'property-name' })
  propertyName: string = '';

  @property({ type: String, attribute: 'editor-type' })
  editorType: string = EditorType.SIMPLE;

  @property({ attribute: false })
  vtbElement: any | null = null;

  private get _editor(): HTMLElement | null {
    console.debug(
      'editor: ',
      this.renderRoot.querySelector('div#editor-' + this.id)
    );
    return this.renderRoot.querySelector('div#editor-' + this.id);
  }

  static override styles = css`
    :host {
      display: inline-block;
      margin: 0;
      padding: 0;

      border: 1px solid #ff0000;
    }

    :root > div,
    :root > div > div {
      display: inline-block;
      margin: 0;
      padding: 0;

      /* border: 1px solid #ff0000; */
    }

    /* @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap'); */

    /* :root {
      --ck-content-font-family: 'Lato';
    } */

    .main-container {
      font-family: var(--ck-content-font-family);
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }

    .editor-container_inline-editor .editor-container__editor {
      min-width: 795px;
      max-width: 795px;
      min-height: 400px;
    }


    .editor-container__sidebar_ckeditor-ai:has(.ck-tabs.ck-hidden) {
      max-width: 0;
      min-width: 0;
    }

    .vtb-main-editor-container {
      border: 1px solid #ff0000 !important;
    }
  `;

  constructor() {
    super();
    console.debug('[VtbText]:constructor');
    // create an id for the editor when no id is defined
    // this makes sure no conflicts can occur when
    // having multiple editors active at the same time
    if (!this.id) {
      this.id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }
  }

  override createRenderRoot() {
    // ckEditor does not work in the shadow dom
    // it'll throw an error as soon as you try to
    // type anything in the editor.
    // the main error is coming from @ckeditor/ckeditor5-utils/src/dom/getborderwidths
    console.debug('[VtbText]:createRenderRoot');
    return this;
  }

  override connectedCallback() {
    console.debug('[VtbText]:connectedCallback');
    super.connectedCallback();

    // copy innerHTML to the contents property
    this.contents = this.innerHTML.trim();

    // remove all childNodes and add them
    // to the editor container
    let childToDelete = this.lastChild;
    while (childToDelete) {
      this.removeChild(childToDelete);
      childToDelete = this.lastChild;
    }
  }

  override render() {
    console.debug('[VtbText]:render');

    // nothing fancy to render..
    return html`
      <div class="vtb-main-editor-container" id="editor-container-${this.id}" @click=${this.clickHandler}>
        <div class="editor-container editor-container_inline-editor">
          <div class="editor-container__editor">
            <div class="vtb-editor" id="editor-${this.id}">${unsafeHTML(this.contents)}</div>
          </div>
        </div>
      </div>
    `;
  }

  clickHandler(_e: Event) {
    console.info('[VtbText]:clickHandler: ', _e);

    console.debug('check innerHTML and content: ', {
      innerHTML: this.innerHTML,
      contents: this.contents,
      'same?': this.innerHTML == this.contents
    });

    if (this.isEditorInitialized && this._destroy_timer) {
      // console.debug('clear editor destruction timer');
      clearTimeout(this._destroy_timer);
      this._destroy_timer = undefined;
    }

    if (this.editable && !this.isEditorInitialized) {
      console.debug('initializing editor: ', this.editorType);

      if (!this._editor) {
        console.warn('not initializing the editor, editor is null');
        return;
      }

      // set the inialized bit..
      this.isEditorInitialized = true;

      if (this.editorType == EditorType.SIMPLE) {
        console.info('[VtbText]:initialize simple editor');
        // TODO: setup a simple editor
        this.editor = SimpleTextEditor.create(this._editor);
        this.editor?.addEventListener('lostFocus', () => this.lostFocus());
      }
      else {
        console.info('[VtbText]:initialize rich editor');

        const currentConfig = { ...this.editorConfig };
        if ( currentConfig.root) {
          currentConfig.root.initialData = this.innerHTML || '';
        }
        else {
          currentConfig.initialData = this.innerHTML || '';
        }


        InlineEditor.create(this._editor, currentConfig)
          .then((editorInstance) => {
            console.debug('promise:then');
            this.editor = editorInstance;

            if (!this.editor) {
              console.debug('no editor (yet)');
              return;
            }

            // keep track on focus.
            // if lostFocus and changed, trigger changed event
            this.editor.ui.focusTracker.on(
              'change:isFocused',
              (_evt, _name, isFocused) => {
                console.debug('focus changed');
                if (!isFocused) {
                  this.lostFocus();
                }
              }
            );

            // since we are initializing dynamically, we need to explicitly focus
            this.editor.focus();
          })
          .catch((error) => {
            console.debug('received error');
            console.error(error.stack);
          });
      }
    }
  }

  protected lostFocus() {
    console.debug('[VtbText]:lostFocus');

    if (!this.editor) {
      console.debug('no editor (yet)');
      return;
    }

    console.debug('changed data: ', this.editor.getData());

    // dispatch custom event
    const changed_content = this.editor.getData();

    const event = new CustomEvent('vtbTextChanged', {
      detail: {
        objectId: this.objectId,
        propertyName: this.propertyName,
        content: changed_content
      },
      bubbles: true
    });
    console.debug('[VtbText]:dispatching change event: ', event);
    this.dispatchEvent(event);

    // schedule destroying the editor after losing focus
    // console.debug('schedule destroy');
    const destroy = this._destroyEditor.bind(this);
    this._destroy_timer = setTimeout(destroy, 3000);

    // }
  }

  protected _destroyEditor() {
    console.debug('destroying editor..');
    if (this.editor) {
      console.debug('editor: ', this.editor);
      // const changed_content = this.editor.getData();

      // this._editor.style.display = 'none';

      this.editor.destroy();
      this.isEditorInitialized = false;
      delete this.editor;

      // if (this._editor){
      //   console.debug('set innerHTML: ', changed_content);
      //   this._editor.innerHTML = changed_content;
      // }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-text': VtbTextElement;
  }
}
