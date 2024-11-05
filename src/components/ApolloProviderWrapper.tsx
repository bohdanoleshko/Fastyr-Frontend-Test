"use client"
import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

const ApolloProviderWrapper = ({ children }: ApolloProviderWrapperProps) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default ApolloProviderWrapper;
