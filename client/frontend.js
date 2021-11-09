import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'

Vue.config.productionTip = false;

Vue.component('loader', {
    template: `
    <div style="display:flex; justify-content: center; align-items: center">
        <div class="spinner-grow text-light mt-xxl-5" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
})

new Vue({
    el: '#app',
    data() {
        return {
            loading: false,
            activeButton: 'chemistry',
            loadMore: 5,
            feed: {},
            chem_list: [],
            pharma_list: []
        }
    },
    methods: {
        updateInfScr() {
            this.loadMore = 5
            this.chem_list = this.chem_list.slice(0, 5 + this.loadMore)
            this.pharma_list = this.pharma_list.slice(0, 5 + this.loadMore)
        },
        handleScroll() {
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 65) {
                this.loadMore += 5;
                if (this.activeButton === 'chemistry') {
                    this.chem_list = [
                        ...this.feed.CHEM_LIST.slice(0, this.loadMore)
                    ]
                }
                else if (this.activeButton === 'pharma') {
                    this.pharma_list = [
                        ...this.feed.PHARMA_LIST.slice(0, this.loadMore)
                    ]
                }
            }
        }
    },
    async mounted() {
        this.loading = true
        this.feed = await request('/api/feed')
        this.chem_list = this.feed.CHEM_LIST.slice(0, 10)
        this.pharma_list = this.feed.PHARMA_LIST.slice(0, 10)
        this.loading = false
        window.addEventListener('scroll', this.handleScroll)
    }
})

async function request(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })

        return await response.json()

    } catch (e) {
        console.warn('Error: ', e.message)
    }
}