import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
// import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
// import Image from '@ckeditor/ckeditor5-image/src/image';
// import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
// import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
// import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
// import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Command from '@ckeditor/ckeditor5-core/src/command';
// import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { ButtonView } from 'ckeditor5/src/ui';
import '@ckeditor/ckeditor5-theme-lark';
class VtbTextSaveCommand extends Command {
    execute() {
        console.info('VtbTextSaveCommand:execute');
        // console.info(this.editor);
    }
}
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
function VtbTextSave(editor) {
    // console.info('VtbTextSave registerd');
    editor.commands.add('save', new VtbTextSaveCommand(editor));
    editor.ui.componentFactory.add('save', (locale) => {
        const button = new ButtonView(locale);
        // const command = editor.commands.get('save');
        const t = editor.t;
        button.set({
            label: t('Save'),
            withText: true,
            tooltip: true,
            isToggleable: true,
        });
        button.on('execute', () => {
            editor.execute('save');
            editor.editing.view.focus();
        });
        // button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
        return button;
    });
}
let VtbTextElement = class VtbTextElement extends LitElement {
    get _editor() {
        return this.querySelector('div#editor-' + this.id);
    }
    constructor() {
        super();
        this.isEditorInitialized = false;
        this.dataIsChanged = false;
        this.editor = undefined;
        this.editable = false;
        this.contents = '';
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
    createRenderRoot() {
        // ckEditor does not work in the shadow dom
        // it'll throw an error as soon as you try to
        // type anything in the editor.
        // the main error is coming from @ckeditor/ckeditor5-utils/src/dom/getborderwidths
        // console.debug('vtbtext:createRenderRoot');
        return this;
    }
    connectedCallback() {
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
    render() {
        // console.debug('vtbtext:render');
        // TODO: check if innerHTML and content are the same,
        // if not copy contents to innerHTML
        // console.debug('check innerHTML and content: ', {
        //   'innerHTML': this.innerHTML,
        //   'contents': this.contents,
        //   'same?': Boolean(this.innerHTML == this.contents)
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
        // // console.debug('check innerHTML and content: ', {
        //   innerHTML: this.innerHTML,
        //   contents: this.contents,
        //   'same?': Boolean(this.innerHTML == this.contents),
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
                    VtbTextSave,
                    Essentials,
                    Heading,
                    Bold,
                    Italic,
                    Link,
                    List,
                    Paragraph,
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
                    'redo',
                ],
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
                this.editor.ui.focusTracker.on('change:isFocused', (_evt, _name, isFocused) => {
                    // console.debug('focus changed');
                    if (!isFocused) {
                        this.lostFocus();
                    }
                });
                // since we are initializing dynamically, we need to explicitly focus
                this.editor.focus();
            })
                .catch((error) => {
                // console.debug('received error');
                console.error(error.stack);
            });
        }
    }
    lostFocus() {
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
                content: changed_content,
            },
            bubbles: true,
        });
        // console.debug('dispatching change event: ');
        this.dispatchEvent(event);
        // schedule destroying the editor after losing focus
        // console.debug('schedule destroy');
        const destroy = this._destroyEditor.bind(this);
        this._destroy_timer = setTimeout(destroy, 3000);
        // }
    }
    _destroyEditor() {
        // console.debug('destroying editor..');
        if (this.editor) {
            this.editor.destroy();
            this.isEditorInitialized = false;
            delete this.editor;
        }
    }
};
VtbTextElement.shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
};
VtbTextElement.styles = css `
    :host {
      display: block;
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
            return Boolean(newVal !== oldVal);
        },
    })
], VtbTextElement.prototype, "contents", void 0);
VtbTextElement = __decorate([
    customElement('vtb-text')
], VtbTextElement);
export { VtbTextElement };
//# sourceMappingURL=text.js.map