Vue.component('product-review', {
    template: `
<form class="review-form" @submit.prevent="onSubmit">

<p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>

 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>
   <label>Would you recommend this product?</label>
   <label>
     <input type="radio" value="yes" v-model="recommendation"> Yes
   </label>
   <label>
     <input type="radio" value="no" v-model="recommendation"> No
   </label>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null, // Новое поле для хранения ответа
            errors: []
        }
    },
    methods:{
        onSubmit() {
            this.errors = []; // Сброс ошибок перед проверкой
            if(this.name && this.review && this.rating && this.recommendation) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation // Добавляем рекомендацию в объект отзыва
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommendation = null // Сброс значения рекомендации
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommendation) this.errors.push("Recommendation required.") // Проверка рекомендации
            }
        }
    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <h2>Details:</h2>
        <ul>
            <li v-for="detail in details" :key="detail">{{ detail }}</li>
        </ul>
    </div>
    `
});

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
            <p v-else style="text-decoration:line-through ">Out of Stock</p>
            <span v-if="onSale">On Sale</span>
            <p>{{ sale }}</p>
            <product-details :details="details"></product-details>
            <p>Shipping: {{ shipping }}</p>
            <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
            ></div>
            <h2>Available Sizes:</h2>
            <ul>
                <li v-for="size in sizes" :key="size">{{ size }}</li>
            </ul>
            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
            <button v-on:click="removeFromCart">Remove from cart</button>
        </div>
        <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
              <li v-for="review in reviews" :key="review.name">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                <p>Recommended: {{ review.recommendation }}</p> <!-- Отображение рекомендации -->
              </li>
            </ul>
           </div> 
           <product-review @review-submitted="addReview"></product-review>
       </div>
    </div>
    `,
    data() {
        return {
            reviews: [],
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            altText: "A pair of socks",
            inStock: true,
            inventory: 100,
            selectedVariant: 0,
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
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
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateCart(id) {
            this.cart.push(id);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },
        removeFromCart(id) {
            this.$emit('remove-from-cart');
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        updateRemoveFromCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        sale() {
            return this.onSale ? `${this.brand} ${this.product} is on sale!` : `${this.brand} ${this.product} is not on sale.`;
        },
        shipping() {
            return this.premium ? "Free" : 2.99;
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        inStock: true,
        cart: []
    },
    methods: {
        updateCart(id)  {
            this.cart.push(id)
        },
        updateRemoveFromCart(id) {
            if (this.cart.length > 0) {
                this.cart.pop(id);
            }
        }
    }
});