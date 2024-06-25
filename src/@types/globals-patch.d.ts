declare namespace Intl {
  function supportedValuesOf(
    key:
      | 'calendar'
      | 'collation'
      | 'currency'
      | 'numberingSystem'
      | 'timeZone'
      | 'unit',
  ): string[];
}
