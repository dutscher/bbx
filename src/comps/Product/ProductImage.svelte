<script lang="ts">
    import { storedImageExtension, storedProducts } from "../../stores";

    export let product: any;
    export let onLoad = () => {};
    let imageExtensions: any;
    let imageExtension: any;
    let overrideExtension: any;
    let imageSrc: any;

    storedImageExtension.subscribe(value => imageExtensions = value);

    $: imageSrc = generateImageSrc(product, imageExtensions, overrideExtension);

    const generateImageSrc = (product, imageExtensions, overrideExtension) => {
        imageExtension = overrideExtension ? overrideExtension : product.imageExt !== undefined ? imageExtensions[product.imageExt] : 'png';
        const image = `${product.id}_${product.image || 1}.${imageExtension}`;
        // "/img/items/100/100300/300/100300_2.jpg"
        const src = `//www.bluebrixx.com/img/items/${('' + product.id).substr(0, 3)}/${product.id}/300/${image}`;
        return src;
    }

    const handleError = (event) => {
        //console.log('generate handleError', imageExtension)
        overrideExtension = imageExtension !== 'jpg' ? 'jpg' : 'png';

        storedProducts.update(storedProducts => {
            storedProducts.map(storedProduct => {
                if(storedProduct.id === product.id){
                    storedProduct.imageExt = 0;
                }
                return storedProduct;
            });
            return storedProducts;
        })
    }
</script>

<img src={imageSrc} on:error={handleError} on:load={onLoad} alt="Produkt Bild" width="100%"/>

<style lang="scss">
  img {
    display: block;
  }
</style>
