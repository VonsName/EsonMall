<template>
    <div>
       <nav-Header></nav-Header>
        <nav-bread>
          <span slot="bread">
            Goods
          </span>
        </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked==='all'}">All</a></dd>
                <dd>
                  <a href="javascript:void(0)" @click="setPriceFilter('0')" v-bind:class="{'cur':priceChecked===0}">0 - 100</a>
                </dd>
                <dd>
                  <a href="javascript:void(0)" @click="setPriceFilter('1')" v-bind:class="{'cur':priceChecked===1}">100 - 500</a>
                </dd>
                <dd>
                  <a href="javascript:void(0)" @click="setPriceFilter('2')" v-bind:class="{'cur':priceChecked===2}">500 - 1000</a>
                </dd>
                <dd>
                  <a href="javascript:void(0)" @click="setPriceFilter('3')" v-bind:class="{'cur':priceChecked===3}">1000 - 2000</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li class="item" v-for="item in goodsList">
                    <div class="pic">
                      <a href="#"><img v-bind:src="'/static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="info">
                      <div class="info-name">{{item.productName}}</div>
                      <div class="info-price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">
          请先登陆在购物！谢谢
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="closeModal">关闭</a>
        </div>
      </Modal>
      <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功！</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
          <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </Modal>
      <nav-footer></nav-footer>
    </div>
</template>

<script>
    import './../assets/css/base.css'
    import './../assets/css/product.css'
    import NavHeader from '@/components/NavHeader'
    import NavFooter from '@/components/NavFooter'
    import NavBread from '@/components/NavBread'
    import axios from 'axios'
    import Modal from '@/components/Modal'
    export default {
      data(){
        return {
          goodsList:[],
          sortFlag:true,
          pageNum:1,
          pageSize:8,
          busy:true,
          loading:false,
          priceChecked:'all',
          mdShow:false,
          mdShowCart:false
        }
      },
        name: "GoodsList",
      components: {NavFooter,NavHeader,NavBread,Modal},
      comments:{
          NavHeader:NavHeader,
          NavFooter:NavFooter,
          NavBread:NavBread,
          Modal:Modal
        },
      mounted: function () {
        this.getGoodsList(false);
      },
      methods:{
          getGoodsList(flag){
            let param={
              pageNum:this.pageNum,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.priceChecked
            };
            this.loading=true;
            axios.get('/goods',{
              params:param
            }).then(res=>{
              let goods=res.data;
              this.loading=false;
              if (flag){
                this.goodsList=this.goodsList.concat(goods.result.list);
                if (goods.result.count===0){
                  this.busy=true;
                }else {
                  this.busy=false;
                }
              }else {
                this.goodsList=goods.result.list;
                this.busy=false;
              }

            })
          },
          sortGoods(){
            this.sortFlag=!this.sortFlag;
            this.pageNum=1;
            this.getGoodsList(false);
          },
        setPriceFilter(index){
          this.priceChecked = index;
          this.pageNum = 1;
          this.getGoodsList(false);
        },
          loadMore(){
            this.busy=true;
            setTimeout(() => {
              this.pageNum++;
              this.getGoodsList(true);
            }, 500);
          },
        addCart(productId){
            axios.post("/goods/addCart",{
              productId:productId
            }).then((res)=>{
               if (res.data.Status==="1"){
                 this.$store.commit('updateCartCount',1);
                 this.mdShowCart=true;
               }else {
                 this.mdShow=true;
               }
            })
        },
        closeModal(){
            this.mdShow=false;
        }
      }
    }
</script>

<style scoped>

</style>
