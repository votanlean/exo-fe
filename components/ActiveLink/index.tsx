import React from 'react';
import { useRouter } from 'next/router';

const ActiveLink = ({ href, children, target }) => {
  const router = useRouter();

  let className = children.props.className || '';
  if (router.pathname === href) {
    className = `${className} active`;
  }

  return (
    <a href={href} target={target}>
      {React.cloneElement(children, { className })}
    </a>
  );
};

export default ActiveLink;
