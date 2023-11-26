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

  static override styles = css`
    :host {
      display: inline-block;
      overflow: hidden;
    }

    img {
      object-fit: cover;
      object-position: center;
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  private _imageStyles(): StyleInfo {
    const imgStyle: StyleInfo = {};
    if (this.width > 0) {
      imgStyle.width = this.width + 'px';
    }

    if (this.height > 0) {
      imgStyle.height = this.height + 'px';
    } else {
      imgStyle.height = '100%';
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
