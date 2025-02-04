Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <a v-bind:href="link">More products like this</a>
            <p v-if="inStock">In stock</p>
            <p v-else style="text-decoration: line-through">Out of Stock</p>
            <span v-if="onSale"> On Sale </span>
            <br><br>
            <p>{{ sale }}</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
            <p>Shipping: {{ shipping }}</p>
            <h2>Details:</h2>
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)"
            ></div>
            <h2>Available Sizes:</h2>
            <ul>
                <li v-for="size in sizes" :key="sizes">{{ size }}</li>
            </ul>
            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>
            <button v-on:click="removeFromCart">Remove from cart</button>
        </div>
    </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks.",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            altText: "A pair of socks",
            inStock: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            inventory: 100,
            selectedVariant: 0,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: []
        }
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            if (this.cart > 0) {
                this.cart -= 1
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        sale() {
            return this.onSale ? `${this.brand} ${this.product} on sale!` : `${this.brand} ${this.product} on not sale.`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        inStock: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            console.log('asd')
            this.cart.push(id);
        }
    }
})



