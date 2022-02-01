import endCursorsFromParse from '../../../data/api-changes.last-cursor.json'
import { queryChanges } from '../../queries';
import { graphql, getProductHref } from '../../utils';
import { ID_PARTS, LOADED, LOADING } from '../../_interfaces';
import { isBluebrixxProduct, updateProductData } from '../../../scripts/handler/interfaces';
import { sortedProducts, storedProducts } from '../products';
import { sortedStates, storedActiveSelection } from '../states';

storedActiveSelection.update(store => {
    store.lastCursor = endCursorsFromParse;
    return store;
});

// changes
let edges = [];
export const loadChanges = async (endCursor?: string) => {
    // first call
    if (!endCursor) {
        storedActiveSelection.update(store => {
            store.loadedData.changes = LOADING;
            store.lastCursor = endCursorsFromParse;
            return store;
        });
    }
    const lastCursorFromJson = endCursorsFromParse[0].split('|')[0];
    const firstPageChanges = await graphql(queryChanges(endCursor || lastCursorFromJson))
    // get results from reverse
    if (firstPageChanges) {
        edges = [...edges, ...firstPageChanges.productChanges.edges];
        if (firstPageChanges.productChanges.pageInfo.hasNextPage) {
            await loadChanges(firstPageChanges.productChanges.pageInfo.endCursor);
        } else {
            evalChanges(edges);
        }
    }
};

const evalChanges = (edges: any) => {
    const updates = {};
    const latestChangesIds = [];
    const latestChanges = [];
    const newProducts = [];
    const newProductIds = [];

    Array.from(edges).map((edge:any) => {
        const change = edge.node;
        const product = change.product;
        const category = product.category.edges[0].node;

        if (isBluebrixxProduct(product, category)) {
            // product.id: 123456
            const id = product['_id'];
            // status.id: UNAVAILABLE
            const status = product.status['_id'];
            // lastchange: 2021-07-03T11:21:07+00:00
            const date = product.lastchange;
            // get product
            const found = sortedProducts.find((product) => product.id === id);
            const state = sortedStates.find((state) => state.api === status);
            const stateDate = new Date(date).getTime();
            // if exists in db and has another state
            if (found) {
                const isPart = found.tags.includes(ID_PARTS);
                if (!(id in updates)) {
                    updates[id] = {
                        history: {}
                    }
                }
                // state change
                if (found.state.id !== state.id) {
                    updates[id].state = state;
                    updates[id].stateDate = stateDate;
                    updates[id].history[stateDate] = state.id;
                }
                // title, price or pieces changes
                if (product.name !== found.title && !isPart) {
                    updates[id].title = product.name;
                }
                if (product.pcs !== found.parts) {
                    updates[id].parts = product.pcs;
                }
                if (product.price !== parseInt(found.price) && product.price !== null) {
                    updates[id].price = product.price;
                }
                latestChangesIds.push(id);
                latestChanges.push(found);

            } else if (!found && !newProductIds.includes(id)) {
                // complete new product
                newProductIds.push(id);
                newProducts.push(
                    updateProductData({
                            title: product.name,
                            id,
                            parts: product.pcs,
                            price: product.price,
                            cats: [],
                            tags: [],
                            state,
                            stateDate,
                            matchTo: product.name,
                            history: {
                                [stateDate]: state.id
                            },
                            href: getProductHref({title: product.name, id}),
                        },
                        {
                            catName: category.name,
                            catId: category['_id'],
                        })
                );
            }
        }
    });
    // changeDate: "21.06.2021 12:52"
    const findHistoryOnSameDay = (changeDate, historyEntries) => {
        return Object.keys(historyEntries).some(entryDate => entryDate.includes(changeDate.split(' ')[0]))
    }
    // update store
    storedProducts.update((value: any) => {
        let updatesForProducts = value.map((product) => {
            // if (product.id === 104313) {
            //     console.log(product, updates[product.id])
            // }
            if (product.id in updates) {
                const productUpdates = updates[product.id];
                if ('state' in productUpdates) {
                    product.state = productUpdates.state;
                    product.stateDate = productUpdates.stateDate;
                }
                if ('title' in productUpdates) {
                    product.title = productUpdates.title;
                }
                if ('parts' in productUpdates) {
                    product.parts = productUpdates.parts;
                }
                if ('price' in productUpdates) {
                    product.price = productUpdates.price;
                    product.pricePerPart = product.price && product.parts ? (product.price / product.parts) * 100 : 0;
                }
                // history: "21.06.2021 12:52": 1
                product.history = {
                    ...product.history,
                    ...updates[product.id].history
                };
            }
            return product;
        });

        // add new products
        if (newProducts.length > 0) {
            //console.log(newProducts)
            updatesForProducts = [...updatesForProducts, ...newProducts];
        }

        storedActiveSelection.update(store => {
            store.loadedData.changes = LOADED;
            return store;
        });

        //console.log('after store update')
        return updatesForProducts;
    });
}
