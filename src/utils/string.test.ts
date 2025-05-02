import {strip_tags} from './string';

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
  expect(strip_tags('<p><span>test</span>test</p>', ['span'])).toBe(
    '<span>test</span>test'
  );
});
