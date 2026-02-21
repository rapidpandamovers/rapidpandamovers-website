import { ReactNode, isValidElement, Children, cloneElement, ReactElement } from 'react';

export function stripDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿¡]/g, '');
}

export function stripDiacriticsFromNode(node: ReactNode): ReactNode {
  if (typeof node === 'string') {
    return stripDiacritics(node);
  }
  if (typeof node === 'number') {
    return node;
  }
  if (Array.isArray(node)) {
    return Children.map(node, stripDiacriticsFromNode);
  }
  if (isValidElement(node)) {
    const element = node as ReactElement<any>;
    return cloneElement(element, {
      ...element.props,
      children: Children.map(element.props.children, stripDiacriticsFromNode),
    });
  }
  return node;
}
