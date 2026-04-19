import {
  padStart,
  merge,
  isUndefined,
  isString,
  isObject,
  isArray,
  isFunction,
  throttle,
  debounce,
} from 'lodash-es';
// lodash-es utilities

export default {
  isUndefined,
  padStart,
  merge,
  isString,
  isObject,
  isArray,
  isFunction,
  debounce,
  throttle: throttle as any,
};
