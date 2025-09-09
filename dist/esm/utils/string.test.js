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
import { strip_tags } from './string';
test('strip_tags', () => {
    expect(strip_tags('<p>test</p>')).toBe('test');
    expect(strip_tags('<p>test</p>', ['p'])).toBe('<p>test</p>');
    expect(strip_tags('<p>test</p>', ['p', 'span'])).toBe('<p>test</p>');
    expect(strip_tags('<p>test</p>', ['span'])).toBe('test');
    expect(strip_tags('<p>test</p>', ['span', 'p'])).toBe('<p>test</p>');
    expect(strip_tags('')).toBe('');
    expect(strip_tags()).toBe('');
    expect(strip_tags('test')).toBe('test');
    expect(strip_tags('test', ['p'])).toBe('test');
    expect(strip_tags('test', ['p', 'span'])).toBe('test');
    expect(strip_tags('test', ['span'])).toBe('test');
    expect(strip_tags('test', ['span', 'p'])).toBe('test');
    expect(strip_tags('&nbsp;')).toBe(' ');
    expect(strip_tags('<p><span>test</span>test</p>', ['span'])).toBe('<span>test</span>test');
});
//# sourceMappingURL=string.test.js.map