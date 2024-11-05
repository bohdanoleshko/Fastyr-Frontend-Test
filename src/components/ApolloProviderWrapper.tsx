"use client"

import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';

const ApolloProviderWrapper = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default ApolloProviderWrapper;