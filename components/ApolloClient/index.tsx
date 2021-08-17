import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: process.env.QUICKSWAP_INFO_API,
    cache: new InMemoryCache()
});

const ApolloClientProvider = ({ children }) => {
    return(
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}

export default ApolloClientProvider;