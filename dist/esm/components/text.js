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
import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
// import {styleMap, StyleInfo} from 'lit/directives/style-map.js';
import { InlineEditor, Alignment, Autosave, Bold, Essentials, FontBackgroundColor, FontColor, FontFamily, FontSize, Heading, Highlight, HorizontalLine, Indent, IndentBlock, Italic, 
// Link,
List, Paragraph, PasteFromOffice, RemoveFormat, Strikethrough, Subscript, Superscript, Underline } from 'ckeditor5';
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
let VtbTextElement = class VtbTextElement extends LitElement {
    get _editor() {
        console.debug('editor: ', this.renderRoot.querySelector('div#editor-' + this.id));
        return this.renderRoot.querySelector('div#editor-' + this.id);
    }
    constructor() {
        super();
        this.isEditorInitialized = false;
        this.dataIsChanged = false;
        this.editor = undefined;
        this.LICENSE_KEY = 'GPL';
        this.editorConfig = {
            toolbar: {
                items: [
                    'undo',
                    'redo',
                    '|',
                    'heading',
                    '|',
                    'fontSize',
                    'fontFamily',
                    'fontColor',
                    'fontBackgroundColor',
                    '|',
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'subscript',
                    'superscript',
                    'removeFormat',
                    '|',
                    'horizontalLine',
                    'highlight',
                    '|',
                    'alignment',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'outdent',
                    'indent'
                ],
                shouldNotGroupWhenFull: false
            },
            plugins: [
                Alignment,
                Autosave,
                Bold,
                Essentials,
                FontBackgroundColor,
                FontColor,
                FontFamily,
                FontSize,
                Heading,
                Highlight,
                HorizontalLine,
                Indent,
                IndentBlock,
                Italic,
                List,
                Paragraph,
                PasteFromOffice,
                RemoveFormat,
                Strikethrough,
                Subscript,
                Superscript,
                Underline
            ],
            balloonToolbar: [
                'bold',
                'italic',
                '|',
                'link',
                '|',
                'bulletedList',
                'numberedList'
            ],
            fontFamily: {
                supportAllValues: true
            },
            fontSize: {
                options: [10, 12, 14, 'default', 18, 20, 22],
                supportAllValues: true
            },
            heading: {
                options: [
                    {
                        model: 'paragraph',
                        title: 'Paragraph',
                        class: 'ck-heading_paragraph'
                    },
                    {
                        model: 'heading1',
                        view: 'h1',
                        title: 'Heading 1',
                        class: 'ck-heading_heading1'
                    },
                    {
                        model: 'heading2',
                        view: 'h2',
                        title: 'Heading 2',
                        class: 'ck-heading_heading2'
                    },
                    {
                        model: 'heading3',
                        view: 'h3',
                        title: 'Heading 3',
                        class: 'ck-heading_heading3'
                    },
                    {
                        model: 'heading4',
                        view: 'h4',
                        title: 'Heading 4',
                        class: 'ck-heading_heading4'
                    },
                    {
                        model: 'heading5',
                        view: 'h5',
                        title: 'Heading 5',
                        class: 'ck-heading_heading5'
                    },
                    {
                        model: 'heading6',
                        view: 'h6',
                        title: 'Heading 6',
                        class: 'ck-heading_heading6'
                    }
                ]
            },
            // initialData:
            //   "<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou've successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What's next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor's\n\t\tconfiguration to match your application's style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don't hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<p>\n\t<i>An editor without the </i><code>Link</code>\n\t<i>plugin? That's brave! We hope the links below will be useful anyway </i>😉\n</p>\n<ul>\n\t<li>📝 Trial sign up: https://portal.ckeditor.com/checkout?plan=free,</li>\n\t<li>📕 Documentation: https://ckeditor.com/docs/ckeditor5/latest/installation/index.html,</li>\n\t<li>⭐️ GitHub (star us if you can!): https://github.com/ckeditor/ckeditor5,</li>\n\t<li>🏠 CKEditor Homepage: https://ckeditor.com,</li>\n\t<li>🧑‍💻 CKEditor 5 Demos: https://ckeditor.com/ckeditor-5/demo/</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser's\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n",
            licenseKey: this.LICENSE_KEY,
            link: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                decorators: {
                    toggleDownloadable: {
                        mode: 'manual',
                        label: 'Downloadable',
                        attributes: {
                            download: 'file'
                        }
                    }
                }
            },
            placeholder: 'Type or paste your content here!',
            updateSourceElementOnDestroy: true
        };
        this.editable = false;
        this.contents = '';
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
    createRenderRoot() {
        // ckEditor does not work in the shadow dom
        // it'll throw an error as soon as you try to
        // type anything in the editor.
        // the main error is coming from @ckeditor/ckeditor5-utils/src/dom/getborderwidths
        console.debug('vtbtext:createRenderRoot');
        return this;
    }
    connectedCallback() {
        console.debug('vtbtext:connectedCallback');
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
    render() {
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
        return html `
      <div id="editor-container-${this.id}" @click=${this.clickHandler}>
        <div id="editor-${this.id}">${unsafeHTML(this.contents)}</div>
      </div>
    `;
    }
    clickHandler(_e) {
        // console.debug('vtbtext:clickHandler: ', _e);
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
            console.debug('initializing editor');
            if (!this._editor) {
                console.warn('not initializing the editor, editor is null');
                return;
            }
            // set the inialized bit..
            this.isEditorInitialized = true;
            const currentConfig = { ...this.editorConfig };
            currentConfig.initialData = this.innerHTML || '';
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
                this.editor.ui.focusTracker.on('change:isFocused', (_evt, _name, isFocused) => {
                    console.debug('focus changed');
                    if (!isFocused) {
                        this.lostFocus();
                    }
                });
                // since we are initializing dynamically, we need to explicitly focus
                this.editor.focus();
            })
                .catch((error) => {
                console.debug('received error');
                console.error(error.stack);
            });
        }
    }
    lostFocus() {
        console.debug('vtbtext:lostFocus');
        if (!this.editor) {
            console.debug('no editor (yet)');
            return;
        }
        console.debug('changed data: ', this.editor.getData());
        // dispatch custom event
        const changed_content = this.editor.getData();
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
    _destroyEditor() {
        console.debug('destroying editor..');
        if (this.editor) {
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
};
VtbTextElement.shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
};
VtbTextElement.styles = css `
    :host {
      display: block;
      margin: 0;
      padding: 0;
    }

    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap');

    :root {
      --ck-content-font-family: 'Lato';
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
__decorate([
    property({ type: Boolean })
], VtbTextElement.prototype, "editable", void 0);
__decorate([
    property({
        type: String,
        attribute: false,
        hasChanged(newVal, oldVal) {
            return newVal !== oldVal;
        }
    })
], VtbTextElement.prototype, "contents", void 0);
VtbTextElement = __decorate([
    customElement('vtb-text')
], VtbTextElement);
export { VtbTextElement };
//# sourceMappingURL=text.js.map