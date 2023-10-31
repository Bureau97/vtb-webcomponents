// import Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';

import { Dictionary } from './interfaces';

declare global {
  interface Window {
    _ckEditorTypes: Dictionary<typeof InlineEditor>;
    _ckEditorInstances: Dictionary<InlineEditor>;
  }
}

class VtbTextEditorManager {

  constructor()
  {
    window['_ckEditorTypes'] = window['_ckEditorTypes'] || {};
    window['_ckEditorInstances'] = window['_ckEditorInstances'] || {};
  }

  registerEditorType(name: string, editor: typeof InlineEditor) : void
  {

    if (typeof window === 'undefined') {
      console.warn('window is not defined');
      return;
    }

    window['_ckEditorTypes'][name] = editor;
  }

  getEditorType(name: string) : typeof InlineEditor | null
  {
    if (typeof window === 'undefined') {
      console.warn('window is not defined');
      return null;
    }

    if (!window['_ckEditorTypes'][name]) {
      throw new Error('Editor type ' + name + ' is not registered');
    }

    return window['_ckEditorTypes'][name] || null;
  }

  registeredEditorTypes(): Array<string>
  {
    if (typeof window === 'undefined') {
      console.warn('window is not defined');
      return [];
    }

    return Object.keys(window['_ckEditorTypes']);
  }

  registerEditorInstance(name: string, editor: InlineEditor) : void
  {
    console.info('registerEditorInstance', name, editor);
    if (typeof window === 'undefined') {
      console.warn('window is not defined');
      return;
    }
    window['_ckEditorInstances'][name] = editor;
  }

  getEditorInstance(name: string) : InlineEditor | null
  {
    if (typeof window === 'undefined') {
      console.warn('window is not defined');
      return null;
    }
    if (!window['_ckEditorInstances'][name]) {
      throw new Error('Editor instance ' + name + ' is not registered');
    }
    return window['_ckEditorInstances'][name] || null;
  }
}

export default new VtbTextEditorManager();
