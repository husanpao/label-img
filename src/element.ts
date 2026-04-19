import _ from './lodash';

export const create = <K extends keyof HTMLElementTagNameMap>(
  tagName: K
): HTMLElementTagNameMap[K] => document.createElement(tagName);

const style = (
  ele: HTMLElement,
  name: keyof CSSStyleDeclaration,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ele.style as any)[name] = value;
};
const styles = (ele: HTMLElement, attrs: Partial<CSSStyleDeclaration>) => {
  _.merge(ele.style, attrs);
};
export const css = (
  ele: HTMLElement,
  name: keyof CSSStyleDeclaration | Partial<CSSStyleDeclaration>,
  attr?: string | number
): string | void => {
  if (_.isString(name)) {
    if (attr) {
      style(ele, name, attr);
    } else {
      return ele.style[name] as string;
    }
  } else if (_.isObject(name)) {
    styles(ele, name);
  }
};
