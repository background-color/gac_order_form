var config = new configClass();
Vue.use(VeeValidate);

var app = new Vue({
  el: '#app',
  data: {
    info: '',
    warning: '',
    status: 'search',
    isLoad: false,
    user_id: '',
    user:{},
    items: {},
  },
  methods: {
    clear(){
      this.info = "";
      this.warning = "";
    },
    user_search(){
      this.clear();
      this.isLoad = true;
      axios
        .get(config.gas_api_url + "?a=user&id=" + this.user_id)
        .then((res) => {
          this.isLoad = false;
          if(res.data.id){
            this.user = res.data;
            this.get_items();
          } else {
            this.warning = "ユーザIDが正しくありません";
          }
        });
    },
    get_items: function() {
      this.isLoad = true;
      axios
        .get(config.gas_api_url + "?a=item")
        .then((res) => {
          this.items = res.data;
          this.isLoad = false;
          this.status = 'edit';
        });
    },
    submit(){
      this.clear();
      this.isLoad = true;
      var params = new URLSearchParams();
      params.append('user_id', this.user.id);
      params.append('total_amount', this.sum_price);
      for (var i in this.items) {
        params.append('item_'+this.items[i].id, this.items[i].quantity || 0);
      }
      axios
        .post(config.gas_api_url, params)
        .then((res) => {
          this.isLoad = false;
          if(res.data.is_success){
            this.status = 'done';
          } else {
            this.warning = "登録に失敗しました";
          }
        });
    },
  },
  filters: {
    money_delimiter: function(value){
      return value.toLocaleString();
    },
  },
  computed:{
    is_item_quantity_zero: function(){
      return this.sum_quantity == 0
    },
    sum_quantity: function(){
      var quantity = 0;
      for (var i in this.items) {
        item = this.items[i];
        if (item.quantity) quantity += item.quantity-0;
      }
      return quantity;
    },
    sum_price: function(){
      var price = 0;
      for (var i in this.items) {
        item = this.items[i];
        if (item.quantity) price += ((item.price-0) * (item.quantity-0));
      }
      return price;
    },
  },
  created() {
  },
})


