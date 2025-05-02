import { currency } from './currency';
test('currency', () => {
    expect(currency(1000, 'en-US', 'USD')).toMatch(/\$1,000\.00/);
    expect(currency(1000)).toMatch(/€\s1\.000,00/);
});
//# sourceMappingURL=currency.test.js.map