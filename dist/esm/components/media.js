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
        this.cover = false;
        this.cover_position = '';
    }
    _imageStyles() {
        const imgStyle = {};
        // copy element styles set on element.style
        const elementStyle = this.style || '';
        for (let i = elementStyle.length; i--;) {
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
        }
        else {
            imgStyle.maxWidth = imgStyle.maxWidth || '100%';
            imgStyle.maxHeight = imgStyle.maxHeight || '100%';
            imgStyle.objectFit = 'contain';
            imgStyle.objectPosition = this.cover_position
                ? this.cover_position
                : 'center';
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
      display: block;
      margin: 0 auto;
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
__decorate([
    property({ type: Boolean })
], VtbMediaElement.prototype, "cover", void 0);
__decorate([
    property({ type: String, attribute: 'cover-position' })
], VtbMediaElement.prototype, "cover_position", void 0);
VtbMediaElement = __decorate([
    customElement('vtb-media')
], VtbMediaElement);
export { VtbMediaElement };
//# sourceMappingURL=media.js.map