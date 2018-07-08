<template>
    <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}</span>
              <span>Order total：{{orderTotal|currency('$')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal :mdShow="orderNull" @close="closeModal">
        <p slot="message">{{orderNullMessage}}</p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="orderNull=false">确认</a>
          <a class="btn btn--m btn--red" href="javascript:;" @click="orderNull = false">关闭</a>
        </div>
      </Modal>
      <Modal :mdShow="orderFail" @close="closeModal">
        <p slot="message">{{orderFailMessage}}</p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="orderFail=false">确认</a>
          <a class="btn btn--m btn--red" href="javascript:;" @click="orderFail = false">关闭</a>
        </div>
      </Modal>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import {currency} from './../util/currency'
    import Modal from './../components/Modal'
    import axios from 'axios'
    export default{
        data(){
            return{
                orderId:'',
                orderTotal:0,
                orderNull:false,
                orderFail:false,
                orderNullMessage:"",
                orderFailMessage:""
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
        },
        filters:{
          currency:currency
        },
        methods:{
          closeModal(){
            this.orderNull=false;
            this.orderFail=false;
          },
        },
        mounted(){
            let orderId = this.$route.query.orderId;
            console.log("orderId:"+orderId);
            if(!orderId){
              return;
            }
            axios.get("/users/orderDetail",{
                params:{
                  orderId:orderId
                }
            }).then((response)=>{
                let res = response.data;
                if(res.Status==='1'){
                    this.orderId = orderId;
                    this.orderTotal = res.result.orderTotal;
                }else if (res.Status==='3'){
                    this.orderNullMessage=res.msg;
                    this.orderNull=true;
                }else {
                    this.orderFailMessage=res.msg;
                    this.orderFail=true;
                }
            });
        }
    }
</script>
