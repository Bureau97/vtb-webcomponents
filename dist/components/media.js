var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
let VtbMediaElement = class VtbMediaElement extends LitElement {
    constructor() {
        super(...arguments);
        this.src = '';
        this.width = Number.NaN;
        this.height = Number.NaN;
        this.crop = '';
        this.alt = '';
    }
    _imageStyles() {
        const imgStyle = {};
        if (this.width > 0) {
            imgStyle.width = this.width + 'px';
        }
        if (this.height > 0) {
            imgStyle.height = this.height + 'px';
        }
        else {
            imgStyle.height = '100%';
        }
        return imgStyle;
    }
    _applyCrop(src, crop) {
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
                console.debug('Requested crop is the same as current crop, return original url. Remove crop (attribute) from vtb-media element for optimization.');
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
    render() {
        const imgStyle = this._imageStyles();
        let src = this.src;
        if (src) {
            if (this.crop) {
                src = this._applyCrop(this.src, this.crop);
            }
            return html `
        <img
          src=${src}
          style=${styleMap(imgStyle)}
          alt=${ifDefined(this.alt)}
        />
      `;
        }
        return '';
    }
};
VtbMediaElement.styles = css `
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
__decorate([
    property({ type: String })
], VtbMediaElement.prototype, "src", void 0);
__decorate([
    property({ type: Number })
], VtbMediaElement.prototype, "width", void 0);
__decorate([
    property({ type: Number })
], VtbMediaElement.prototype, "height", void 0);
__decorate([
    property({ type: String })
], VtbMediaElement.prototype, "crop", void 0);
__decorate([
    property({ type: String })
], VtbMediaElement.prototype, "alt", void 0);
VtbMediaElement = __decorate([
    customElement('vtb-media')
], VtbMediaElement);
export { VtbMediaElement };
//# sourceMappingURL=media.js.map