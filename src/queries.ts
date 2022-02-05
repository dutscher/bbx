import gql from 'graphql-tag';

// https://api.bbx.watch/api/graphql

/*
  $changes.data.productChanges.edges as node
        product:
         id: "/api/products/101332"
         lastchange: "2021-07-01T20:41:05+00:00"
        status:
         id: "/api/product_statuses/BUYABLE"
        -> products -> "id": 101857,
*/
// TODO: get pagination after all!
export const queryChangesGql = (endCursor: string) => gql`${queryChanges(endCursor)}`
export const queryChanges = (endCursor: string) => `
{
    productChanges(
        after: "${endCursor}"
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          datetime
          status{_id}
          product {
            _id
            name
            price
            pcs
            lastchange
            status {
              _id
            }
            category(last: 10) {
              edges {
                node {
                  _id
                  name
                }
              }
            }
          }
        }
      }
    }
}
`;

/*
{product(id:"api/products/604337"){
id
name
price
pcs
lastchange
category {
    edges {
        node {
            id
            name
        }
    }
}
status {
    id
}
}}
*/
