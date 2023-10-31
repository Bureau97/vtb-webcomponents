import {LitElement, css, html} from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
// import {styleMap, StyleInfo} from 'lit/directives/style-map.js';

import Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
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

// import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave';

import '@ckeditor/ckeditor5-theme-lark';

import editor_manager from '../utils/editor-manager';

import Rect from '@ckeditor/ckeditor5-utils/src/dom/rect';
const _proxy: any = Rect['excludeScrollbarsAndBorders'];
console.info(_proxy);
// delete(Rect['excludeScrollbarsAndBorders']);
// Rect['excludeScrollbarsAndBorders'] = function () {
//   _proxy(...arguments);
// }

@customElement('vtb-text')
export class VtbTextElement extends LitElement {
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  protected isEditorInitialized: Boolean = false;
  protected dataIsChanged: Boolean = false;
  protected editor?: InlineEditor = undefined;
  protected _destroy_timer?: ReturnType<typeof setTimeout>;

  @property({type: Boolean})
  editable: Boolean = false;

  @property({
    type: String,
    attribute: false,
    hasChanged(newVal: string, oldVal: string) {
      return Boolean(newVal !== oldVal);
    },
  })
  public contents = '';

  @query('div#editor')
  _editor!: HTMLElement;

  @query('div#contents')
  _contents!: HTMLElement;

  @queryAssignedElements()
  _content!: Array<HTMLElement>;

  static override styles = css`
    :host {
      display: block;
    }

    // div#editor {
    //   display: block;
    //   width: 100%;
    //   height: 400px;
    //   border: 1px solid #000;
    //   background-color: #fff;
    // }
  `;

  constructor() {
    super();
    editor_manager.registerEditorType('inline', InlineEditor);
  }

  override connectedCallback() {
    console.debug('vtbtext:connectedCallback');
    super.connectedCallback();
    // copy innerHTML to the content property
    this.contents = this.innerHTML;
    console.info(this);
  }

  override render() {
    console.debug('vtbtext:render');
    // check if innerHTML and content are the same,
    // if not copy contents to innerHTML
    console.info('check innerHTML and content: ', {
      'innerHTML': this.innerHTML,
      'contents': this.contents,
      'same?': Boolean(this.innerHTML == this.contents)
    });

    if (this.innerHTML != this.contents) {
      console.info('copy contents to innerHTML');
      this.innerHTML = this.contents;
    }

    // nothing fancy to render..
    return html`
      <div @click=${this.clickHandler}>
        <div
          id="editor"
          class="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred"
        ></div>
        <div id="contents"></div>
        <slot @slotchange=${this.handleSlotchange}></slot>
      </div>
    `;
  }

  handleSlotchange(e: Event) {
    console.info('handleSlotchange: ', e);
    const slot = e.target as HTMLSlotElement;
    const childNodes = slot.assignedNodes({flatten: true});
    console.info(childNodes);
    // this.allText = childNodes.map((node) => {
    //   return node.textContent ? node.textContent : ''
    // }).join('');
  }

  clickHandler(_e: Event) {
    console.info('received click');
    console.info(this);
    if (this.isEditorInitialized && this._destroy_timer) {
      console.debug('clear editor destruction timer');
      clearTimeout(this._destroy_timer);
      this._destroy_timer = undefined;
    }

    if (this.editable && !this.isEditorInitialized) {
      // just a little scope hack
      console.info('initializing editor');
      console.info(this._editor);
      console.info(this.shadowRoot?.querySelector('slot'));

      // set the inialized bit..
      this.isEditorInitialized = true;

      // setup customized! InlineEditor
      const builder: typeof InlineEditor | null = editor_manager.getEditorType('inline');
      if (!builder) {
        console.error('builder is null');
        return;
      }

      builder.create(this._editor, {
        updateSourceElementOnDestroy: true,
        // every tool has a plugin!
        plugins: [
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
        // autosave: {
        //   save(editor: Editor) {
        //     console.info('autosave:save', editor);
        //     // return proxy(editor);
        //     return new Promise((resolve) => {
        //       // nothing much, just set the dataIsChanged bit..
        //       // TODO: only set when changed!..
        //       // this.dataIsChanged = true;
        //       console.info('receiveupdate');
        //       return resolve(editor);
        //     });
        //   }
        // },
      })
        .then((editorInstance) => {
          console.info('promise:then');
          this.editor = editorInstance;

          if (!this.editor) {
            console.info('no editor (yet)');
            return;
          }

          editor_manager.registerEditorInstance('inline', editorInstance);

          // const slot = this.shadowRoot?.querySelector('slot');
          // if (slot) {
          //   slot.style.display = 'none';
          // }

          // // copy data from lightDom to editor in shadowDom
          // console.info('loading content');
          // let content = '';
          // for (const child of this.children) {
          //   content += child.outerHTML + '\r\n';
          // }

          // // set data on editor
          // console.info('setting data');
          // this.editor.setData(content);

          // // backup for receiving data changed events..
          // // currently using autosave
          // this.editor.model.document.on('change:data', () => {
          //   console.debug('The data has changed!');
          // });

          // // keep track on focus.
          // // if lostFocus and changed, trigger changed event
          // this.editor.ui.focusTracker.on(
          //   'change:isFocused',
          //   (_evt, _name, isFocused) => {
          //     console.info('focus changed');
          //     if (!isFocused) {
          //       this.lostFocus();
          //     }
          //   }
          // );

          // // since we are initializing dynamically, we need to explicitly focus
          // console.info('explicit set focus~');
          // this.editor.focus();
        })
        // .catch((error) => {
        //   console.info('received error');
        //   console.info(error.stack);
        // });
    }
  }

  protected receiveUpdate(editor: Editor) {
    console.info('receiv updatye called');
    return new Promise((resolve) => {
      // nothing much, just set the dataIsChanged bit..
      // TODO: only set when changed!..
      this.dataIsChanged = true;
      console.info('receiveupdate');
      // console.info({
      //   'editor': this.editor?.getData(),
      //   'contents': this.contents,
      //   'innerHTML': this.innerHTML}
      // );
      return resolve(editor);
    });
  }

  protected lostFocus() {
    console.info('lost focus');
    // if (this.dataIsChanged) {
    // copy editor data to content property
    // if (!this.editor) {
    //   console.info('no editor (yet)');
    //   return;
    // }

    // this.contents = this.editor.getData();

    // // dispatch custom event
    // const changed_content = this.editor.getData();
    // const event = new CustomEvent('vtbTextChanged', {
    //   detail: {
    //     content: changed_content,
    //   },
    //   bubbles: true,
    // });
    // this.dispatchEvent(event);

    // // schedule destroying the editor after losing focus
    // console.info('schedule destroy');
    // const destroy = this._destroyEditor.bind(this);
    // this._destroy_timer = setTimeout(destroy, 3000);
    // // }
  }

  protected _destroyEditor() {
    console.info('destroying editor..');
    if (this.editor) {
      // const editor_data = this.editor.getData();
      // this._contents.innerHTML = editor_data;
      // this._contents.style.display = 'block';
      this.editor.destroy();
      this.isEditorInitialized = false;

      const slot = this.shadowRoot?.querySelector('slot');
      if (slot) {
        slot.style.display = 'unset';
      }
    }
  }

  // not used
  protected htmlEntityEncode(text: string) {
    const textArea = document.createElement('textarea');
    textArea.innerText = text;
    let encodedOutput = textArea.innerHTML;
    const arr = encodedOutput.split('<br>');
    encodedOutput = arr.join('\n');
    return encodedOutput;
  }

  // not used
  protected htmlEntityDecode(text: string) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  // protected override createRenderRoot() {
  //   return this;
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-text': VtbTextElement;
  }
}
