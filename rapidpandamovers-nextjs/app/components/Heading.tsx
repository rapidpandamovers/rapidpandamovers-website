import { ComponentPropsWithoutRef } from 'react';
import { stripDiacriticsFromNode } from '@/lib/strip-diacritics';

export function H1(props: ComponentPropsWithoutRef<'h1'>) {
  const { children, ...rest } = props;
  return <h1 {...rest}>{stripDiacriticsFromNode(children)}</h1>;
}

export function H2(props: ComponentPropsWithoutRef<'h2'>) {
  const { children, ...rest } = props;
  return <h2 {...rest}>{stripDiacriticsFromNode(children)}</h2>;
}

export function H3(props: ComponentPropsWithoutRef<'h3'>) {
  const { children, ...rest } = props;
  return <h3 {...rest}>{stripDiacriticsFromNode(children)}</h3>;
}
