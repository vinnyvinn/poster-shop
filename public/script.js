const PRICE = 9.99;
LOAD_NUM = 10;

new Vue({
    el:'#app',
    data:{
        total:0,
        items: [],
        cart:[],
        results:[],
        search:'anime',
        lastsearch:'',
        loading:false,
        price: PRICE
    },
    methods:{
         appendItems(){
          if (this.items.length < this.results.length){
              var append =this.results.slice(this.items.length,this.items.length + LOAD_NUM);
              this.items = this.items.concat(append);
          }
        },
        onSubmit(){
             if (!this.search.length){
                 return;
             }
            this.items = [];
            this.loading = true;
this.$http.get('/search/'.concat(this.search))
    .then(res =>{
        console.log(res.data);
        this.lastsearch = this.search;
        this.results = res.data;
            this.appendItems();
        this.loading =false;
    })
        },
        addItem: function (index) {
            console.log(index);
            this.total += PRICE;
            var item = this.items[index];
            for (var i=0;i< this.cart.length;i++){
                 if (this.cart[i].id === item.id){
                     this.cart[i].qty++;
                     return
                 }
            }
            this.cart.push({
                id:item.id,
                title:item.title,
                qty:1,
                price:PRICE
            });
            console.log(this.cart.length)
        },
        inc:function (item) {
          item.qty++;
          this.total +=PRICE;
        },
        dec:function (item) {
            item.qty--;
            this.total -=PRICE;
            if (item.qty <=0){
                for (var i=0;i<this.cart.length;i++){
                    if (this.cart[i].id === item.id){
                        this.cart.splice(i,1);
                        return;
                    }

                }
            }
        }
    },
    computed:{
        noMoreItems: function(){
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    filters:{
        currency: function (price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted() {
        this.onSubmit();
       var vm=this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function () {
            vm.appendItems();
        })
    }
})

