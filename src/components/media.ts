import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {styleMap, StyleInfo} from 'lit/directives/style-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

@customElement('vtb-media')
export class VtbMediaElement extends LitElement {
  @property({type: String})
  src = '';

  @property({type: Number})
  width = Number.NaN;

  @property({type: Number})
  height = Number.NaN;

  @property({type: String})
  crop?: string = '';

  @property({type: String})
  alt?: string = '';

  @property({type: Boolean})
  cover?: boolean = false;

  @property({type: String, attribute: 'cover-position'})
  cover_position?: string = '';

  static override styles = css`
    :host {
      display: inline-block;
      overflow: hidden;
    }

    img {
      display: block;
      margin: 0 auto;
    }
  `;

  private _imageStyles(): StyleInfo {
    const imgStyle: StyleInfo = {};

    // copy element styles set on element.style
    const elementStyle: CSSStyleDeclaration = this.style || '';
    for (let i = elementStyle.length; i--; ) {
      const nameString = elementStyle[i];
      imgStyle[nameString] = elementStyle.getPropertyValue(nameString);
    }

    if (this.width > 0) {
      imgStyle.width = this.width + 'px';
    }
    // else {
    //   imgStyle.width = 'auto';
    // }

    if (this.height > 0) {
      imgStyle.height = this.height + 'px';
    }
    // else {
    //   imgStyle.height = 'auto';
    // }

    if (this.cover) {
      if ((!this.width || this.width <= 0) && !imgStyle.width) {
        imgStyle.width = '100%';
      }

      if ((!this.height || this.height <= 0) && !imgStyle.height) {
        imgStyle.height = '100%';
      }

      imgStyle.objectFit = 'cover';
      imgStyle.objectPosition = this.cover_position
        ? this.cover_position
        : 'center';
    } else {
      imgStyle.maxWidth = imgStyle.maxWidth || '100%';
      imgStyle.maxHeight = imgStyle.maxHeight || '100%';
      imgStyle.objectFit = 'contain';
      imgStyle.objectPosition = this.cover_position
        ? this.cover_position
        : 'center';
    }

    return imgStyle;
  }

  private _applyCrop(src: string, crop?: string): string {
    if (src && crop) {
      // a url can point to amazoneaws.com:
      // https://s3-eu-west-1.amazonaws.com/media.<customer>.domain/<crop/crop>/filename.jpeg
      // or
      // https://media.<customer>.domain/<crop/crop>/filename.jpeg

      const url = new URL(src);

      const path = url.pathname.split('/');
      const old_crop = [];

      path.shift(); // remove first (empty) element

      old_crop.push(path.splice(path.length - 2, 1)); // remove second part of crop
      old_crop.push(path.splice(path.length - 2, 1)); // remove first part of crop
      old_crop.reverse();

      if (old_crop.join('/') == crop) {
        console.debug(
          'Requested crop is the same as current crop, return original url. Remove crop (attribute) from vtb-media element for optimization.'
        );
        return src;
      }

      // add all pieces to a list
      const src_pieces = [];
      src_pieces.push(url.origin);

      // if path length > 1 we probably have a amazonaws url
      // so we need to add the customer domain part
      if (path.length > 1) {
        src_pieces.push(path.shift());
      }

      // add the new cropsize
      src_pieces.push(crop);

      // add the filename
      src_pieces.push(path.shift());

      // join the pieces back together
      src = src_pieces.join('/');
    }

    return src;
  }

  override render() {
    const imgStyle: StyleInfo = this._imageStyles();
    let src: string = this.src;

    if (src) {
      if (this.crop) {
        src = this._applyCrop(this.src, this.crop);
      }

      return html`
        <img
          src=${src}
          style=${styleMap(imgStyle)}
          alt=${ifDefined(this.alt)}
        />
      `;
    }

    return '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-media': VtbMediaElement;
  }
}
