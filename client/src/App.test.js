/**
 * Basic test suite for Caper Sports application
 * This ensures the test infrastructure is working correctly
 */

describe('Caper Sports Application', () => {
  test('basic test passes', () => {
    expect(true).toBe(true);
  });

  test('environment is configured', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test('React is available', () => {
    const React = require('react');
    expect(React).toBeDefined();
    expect(typeof React.createElement).toBe('function');
  });
});
