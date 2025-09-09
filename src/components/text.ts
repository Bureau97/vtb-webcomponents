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
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
// import {styleMap, StyleInfo} from 'lit/directives/style-map.js';

import {
  // Editor,
  InlineEditor,
  Essentials,
  Bold,
  Italic,
  Heading,
  Link,
  Paragraph,
  List
  // Plugin,
  // Command,
  // ButtonView
} from 'ckeditor5';

// import 'ckeditor5/ckeditor5.css';

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

@customElement('vtb-text')
export class VtbTextElement extends LitElement {
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  protected isEditorInitialized: boolean = false;
  protected dataIsChanged: boolean = false;
  protected editor?: InlineEditor = undefined;
  protected _destroy_timer?: ReturnType<typeof setTimeout>;

  @property({type: Boolean})
  editable: boolean = false;

  @property({
    type: String,
    attribute: false,
    hasChanged(newVal: string, oldVal: string): boolean {
      return newVal !== oldVal;
    }
  })
  contents: string | null = '';

  private get _editor(): HTMLElement | null {
    return this.querySelector('div#editor-' + this.id);
  }

  static override styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    // console.debug('vtbtext:constructor');
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
    // console.debug('vtbtext:createRenderRoot');
    return this;
  }

  override connectedCallback() {
    // console.debug('vtbtext:connectedCallback');
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
    // console.debug('vtbtext:render');

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
        <div id="editor-${this.id}">${unsafeHTML(this.contents)}</div>
      </div>
    `;
  }

  clickHandler(_e: Event) {
    // console.debug('vtbtext:clickHandler: ', _e);

    // // console.debug('check innerHTML and content: ', {
    //   innerHTML: this.innerHTML,
    //   contents: this.contents,
    //   'same?': boolean(this.innerHTML == this.contents),
    // });

    if (this.isEditorInitialized && this._destroy_timer) {
      // console.debug('clear editor destruction timer');
      clearTimeout(this._destroy_timer);
      this._destroy_timer = undefined;
    }

    if (this.editable && !this.isEditorInitialized) {
      // console.debug('initializing editor');

      if (!this._editor) {
        console.warn('not initializing the editor, editor is null');
        return;
      }

      // set the inialized bit..
      this.isEditorInitialized = true;

      InlineEditor.create(this._editor, {
        updateSourceElementOnDestroy: true,
        // every tool has a plugin!
        plugins: [
          // VtbTextSave,
          Essentials,
          Heading,
          Bold,
          Italic,
          Link,
          List,
          Paragraph
          // Autosave,
        ],
        // these are the available tools
        toolbar: [
          // 'save',
          '|',
          'heading',
          '|', // separator!
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'undo',
          'redo'
        ]
      })
        .then((editorInstance) => {
          // console.debug('promise:then');
          this.editor = editorInstance;

          if (!this.editor) {
            // console.debug('no editor (yet)');
            return;
          }

          // keep track on focus.
          // if lostFocus and changed, trigger changed event
          this.editor.ui.focusTracker.on(
            'change:isFocused',
            (_evt, _name, isFocused) => {
              // console.debug('focus changed');
              if (!isFocused) {
                this.lostFocus();
              }
            }
          );

          // since we are initializing dynamically, we need to explicitly focus
          this.editor.focus();
        })
        .catch((error) => {
          // console.debug('received error');
          console.error(error.stack);
        });
    }
  }

  protected lostFocus() {
    // console.debug('vtbtext:lostFocus');

    if (!this.editor) {
      // console.debug('no editor (yet)');
      return;
    }

    // console.debug('changed data: ', this.editor.getData());

    // dispatch custom event
    const changed_content = this.editor.getData();
    const event = new CustomEvent('vtbTextChanged', {
      detail: {
        content: changed_content
      },
      bubbles: true
    });
    // console.debug('dispatching change event: ');
    this.dispatchEvent(event);

    // schedule destroying the editor after losing focus
    // console.debug('schedule destroy');
    const destroy = this._destroyEditor.bind(this);
    this._destroy_timer = setTimeout(destroy, 3000);
    // }
  }

  protected _destroyEditor() {
    // console.debug('destroying editor..');
    if (this.editor) {
      this.editor.destroy();
      this.isEditorInitialized = false;
      delete this.editor;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-text': VtbTextElement;
  }
}
