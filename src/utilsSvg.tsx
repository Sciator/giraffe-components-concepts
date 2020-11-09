
import React, { useEffect, useRef, useState } from "react";

type TSvgTextRectProps = {
  onRectChanged?: (rect: DOMRect) => void,
} & React.SVGProps<SVGTextElement>;

/**
 * Helper component that returns rect when children changes. Usefull for calculating text box size.
 */
export const SvgTextRect: React.FC<TSvgTextRectProps> = (props) => {
  const {
    onRectChanged = () => { },
  } = props;

  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const rect = textRef.current?.getBBox();
    if (!rect) return;

    onRectChanged(rect);
  }, [props.children]);

  return <>
    <text {...props} ref={textRef} />
  </>;
};

