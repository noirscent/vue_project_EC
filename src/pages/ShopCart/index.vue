<template>
  <div>
    <div v-if="!isShowPage">加载中...</div>
    <div class="cart" v-if="isShowPage">
      <h4>全部商品</h4>
      <div class="cart-main">
        <div class="cart-th">
          <div class="cart-th1">全部</div>
          <div class="cart-th2">商品</div>
          <div class="cart-th3">单价（元）</div>
          <div class="cart-th4">数量</div>
          <div class="cart-th5">小计（元）</div>
          <div class="cart-th6">操作</div>
        </div>
        <div class="cart-body">
          <ul
            class="cart-list"
            v-for="cartInfo in cartInfoList"
            :key="cartInfo.id"
          >
            <li class="cart-list-con1">
              <input
                type="checkbox"
                name="chk_list"
                :checked="cartInfo.isChecked"
                @change="updateChecked($event, cartInfo)"
              />
            </li>
            <li class="cart-list-con2">
              <img :src="cartInfo.imgUrl" />
              <div class="item-msg">{{ cartInfo.skuName }}</div>
            </li>
            <li class="cart-list-con3">
              <div class="item-txt">属性未开发</div>
            </li>
            <li class="cart-list-con4">
              <span class="price">{{ cartInfo.skuPrice }}.00</span>
            </li>
            <li class="cart-list-con5">
              <a
                class="mins"
                :class="{ disabled: cartInfo.skuNum <= 1 }"
                @click="changeSkuNum('reduce', -1, cartInfo)"
                >-
              </a>
              <input
                autocomplete="off"
                minnum="1"
                type="number"
                onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                class="itxt"
                :value="cartInfo.skuNum"
                @change="
                  changeSkuNum('change', $event.target.value * 1, cartInfo)
                "
              />
              <a
                href="javascript:;"
                class="plus"
                @click="changeSkuNum('add', 1, cartInfo)"
                >+</a
              >
            </li>
            <li class="cart-list-con6">
              <span class="sum"
                >{{ cartInfo.skuPrice * cartInfo.skuNum }}.00</span
              >
            </li>
            <li class="cart-list-con7">
              <a class="sindelet" @click="deleteCartItem(cartInfo.skuId)"
                >删除</a
              >
              <br />
              <a>移到收藏</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="cart-tool">
        <div class="select-all">
          <input
            class="chooseAll"
            type="checkbox"
            :checked="isAllChecked"
            @click="updateAllItemIsChecked"
          />
          <span> 全选</span>
        </div>
        <div class="option">
          <a @click="deleteAllCheckedItem">删除选中的商品</a>
          <a>移到我的关注</a>
          <a>清除已失效商品</a>
        </div>
        <div class="money-box">
          <div class="chosed">
            已选择 <span>{{ totalCount }}</span
            >件商品
          </div>
          <div class="sumprice">
            <em>总价（不含运费）：</em>
            <i class="summoney">{{ totalPrice }} 元</i>
          </div>
          <div class="sumbtn">
            <router-link class="sum-btn" to="/trade">结算</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { throttle } from "lodash";

export default {
  name: "ShopCart",
  data() {
    return {
      // cartInfoList: [],
      isShowPage: false,
    };
  },
  computed: {
    // 购物车列表数据
    ...mapGetters(["cartInfoList"]),
    // 已选商品
    totalCount() {
      let count = 0;
      this.cartInfoList.forEach((cartInfo) => {
        if (cartInfo.isChecked) {
          count++;
        }
      });
      return count;
    },
    // 总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach((cartInfo) => {
        if (cartInfo.isChecked) {
          sum += cartInfo.skuPrice * cartInfo.skuNum;
        }
      });
      return sum;
    },
    // 是否全部勾选
    isAllChecked() {
      return this.cartInfoList.every((item) => item.isChecked === 1);
    },
  },
  methods: {
    // 获取购物车数据
    async getCartList() {
      this.isShowPage = false;
      await this.$store
        .dispatch("getCartList")
        .then((value) => {
          this.isShowPage = true;
        })
        .catch((reason) => {
          alert(reason);
        });
    },

    // 更改商品数量
    changeSkuNum: throttle(async function (type, changeNum, cartInfo) {
      // 使用lodash节流避免出现点击过快，数量变为负数的bug
      // type用于区分 + - 输入框 这3个元素
      // changeNum表示数量变化量，1表示加1，-1表示减1，0表示不变
      // cartInfo表示哪一个商品
      switch (type) {
        case "add":
          changeNum = 1;
          break;
        case "reduce":
          // 如果数量已经为1了，不能再减少了，就return出函数，不发请求
          if (cartInfo.skuNum === 1) {
            return alert("数量不能小于1！");
          }
          changeNum = -1;
          break;

        case "change":
          // 当用户输入 '0' / 空字符串时，就让其原封不动
          changeNum = changeNum === 0 ? 0 : changeNum - cartInfo.skuNum;
          break;
      }

      // 发送请求将修改数量存储到服务器
      await this.$store
        .dispatch("addOrUpdateShopCart", {
          skuId: cartInfo.skuId,
          skuNum: changeNum,
        })
        .then((value) => {
          // 获取更新后的购物车
          this.getCartList();
        })
        .catch((reason) => {
          alert(reason);
        });
    }, 1000),

    // 删除商品
    async deleteCartItem(skuId) {
      await this.$store
        .dispatch("deleteCartItem", skuId)
        .then((value) => {
          // console.log(value);
          // 删除成功后获取更新后的数据
          this.getCartList();
        })
        .catch((reason) => {
          alert(reason);
        });
    },

    // 修改商品选中状态
    async updateChecked(event, { skuId }) {
      let isChecked = event.target.checked === true ? "1" : "0";
      await this.$store
        .dispatch("updateChecked", { skuId, isChecked })
        .then((value) => {
          // console.log(value)
          // 获取更新后的数据
          this.getCartList();
        })
        .catch((reason) => {
          alert(reason);
        });
    },

    // 删除所有选中商品
    async deleteAllCheckedItem() {
      await this.$store
        .dispatch("deleteAllCheckedItem")
        .then((value) => {
          this.getCartList();
        })
        .catch((reason) => {
          alert(reason);
        });
    },

    // 全选/全不选
    async updateAllItemIsChecked(event) {
      let isAllChecked = event.target.checked === true ? "1" : "0";
      await this.$store
        .dispatch("updateAllItemIsChecked", isAllChecked)
        .then((value) => {
          this.getCartList();
        })
        .catch((reason) => {
          alert(reason);
        });
    },
  },

  created() {
    this.getCartList();
    // this.cartInfoList = JSON.parse(sessionStorage.getItem('cartInfoList'))
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 4.1667%;
        }

        .cart-list-con2 {
          width: 25%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con3 {
          width: 20.8333%;

          .item-txt {
            text-align: center;
          }
        }

        .cart-list-con4 {
          width: 12.5%;
        }

        .cart-list-con5 {
          width: 12.5%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 32px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          .disabled {
            color: #ccc;
            background-color: #f0f0f0;
          }
        }

        .cart-list-con6 {
          width: 12.5%;

          .sum {
            font-size: 14px;
          }
        }

        .cart-list-con7 {
          width: 12.5%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 18px 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 18px 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 15px 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 15px 7px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>