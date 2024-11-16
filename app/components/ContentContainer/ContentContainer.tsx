import { FC, PropsWithChildren } from 'react';

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="vs-content-container mx-auto">{children}</div>;
};
