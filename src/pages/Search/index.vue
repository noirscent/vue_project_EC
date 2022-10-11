<template>
  <div>
    <!-- 三级联动导航栏 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread面包屑，带有x的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <!-- 用户输入关键字面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTrademark">×</i>
            </li>
            <!-- 商品属性面包屑 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <!-- 获取子组件SearchSelector数据 -->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <!-- 分类排序 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 通过判断用户点击的是综合还是价格来切换样式 -->
                <li
                  :class="{ active: isComprehensive }"
                  @click="changeOrder('1')"
                >
                  <a
                    >综合
                    <i
                      v-show="isComprehensive"
                      class="iconfont"
                      :class="{
                        'icon-sort-up': isAsc,
                        'icon-sort-down': !isAsc,
                      }"
                    ></i
                  ></a>
                </li>
                <li :class="{ active: isPrice }" @click="changeOrder('2')">
                  <a
                    >价格
                    <i
                      v-show="isPrice"
                      class="iconfont"
                      :class="{
                        'icon-sort-up': isAsc,
                        'icon-sort-down': !isAsc,
                      }"
                    ></i
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg"/>
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i> {{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" :title="good.title">
                      {{ good.title }}
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      // 传递给服务器的参数
      searchParams: {
        // 分类id
        category1Id: "",
        category2Id: "",
        category3Id: "",
        // 分类名字
        categoryName: "",
        // 用户输入搜索词
        keyword: "",
        // 排序
        order: "1:desc",
        // 当前第几页
        pageNo: 1,
        // 每页展示数据个数
        pageSize: 3,
        // 平台售卖参数
        props: [],
        // 品牌
        trademark: "",
      },
    };
  },
  computed: {
    ...mapState({ total: (state) => state.search.searchList.total }),
    ...mapGetters(["goodsList", "trademarkList", "attrsList"]),
    isComprehensive() {
      return this.searchParams.order.includes("1");
    },
    isPrice() {
      return this.searchParams.order.includes("2");
    },
    isAsc() {
      return this.searchParams.order.includes("asc");
    },
  },
  methods: {
    // 获取仓库中searchList数据
    getSearchList() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    // 删除分类面包屑
    removeCategoryName() {
      this.searchParams.categoryName = undefined;
      // 清空categoryName对应的id
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // 让地址栏回到删除面包屑前的状态，注意保留params参数
      // 注意：此处路由发生跳转，会被watch监测到并发起请求，无需手动发起请求
      this.$router.push({ name: "search", params: this.$route.params || {} });
    },
    // 删除用户输入关键字面包屑
    removeKeyword() {
      this.searchParams.keyword = undefined;
      // 让地址栏回到删除面包屑前的状态，注意保留params参数
      // 注意：此处路由发生跳转，会被watch监测到并发起请求，无需手动发起请求
      this.$router.push({ name: "search", query: this.$route.query || {} });
    },
    // 获取子组件SearchSelector传递的品牌信息，发送请求
    trademarkInfo(trademark) {
      // 整理品牌参数 ID:品牌名称
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // 发送请求
      this.getSearchList();
    },
    // 删除品牌面包屑
    removeTrademark() {
      this.searchParams.trademark = "";
      // 重新发起请求
      this.getSearchList();
    },
    // 获取子组件SearchSelector传递的商品属性信息，发送请求
    attrInfo(attr, attrValue) {
      // 整理参数 ["属性ID:属性值:属性名"]
      const propsValue = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 判断用户点击的属性在原有的props中是否存在
      if (!this.searchParams.props.includes(propsValue)) {
        this.searchParams.props.push(propsValue);
        // 发送请求
        this.getSearchList();
      }
    },
    // 删除商品属性面包屑
    removeAttr(index) {
      this.searchParams.props.splice(index, 1);
      // 发送请求
      this.getSearchList();
    },
    // 修改排序方式
    changeOrder(flag) {
      // flag代表用户点击的是综合还是价格
      let originSort = this.searchParams.order.split(":")[1];

      if (flag === "1") {
        this.searchParams.order = originSort === "desc" ? "1:asc" : "1:desc";
      } else {
        this.searchParams.order = originSort === "desc" ? "2:asc" : "2:desc";
      }
      this.getSearchList();
    },
    // 获取当前显示页数
    getPageNo(pageNo) {
      // console.log(pageNo);
      // 整理参数
      this.searchParams.pageNo = pageNo;
      // 发送请求
      this.getSearchList();
    },
  },
  mounted() {
    // 将多个对象的属性和方法都合并到目标对象searchParams上面
    this.searchParams = Object.assign(
      this.searchParams,
      this.$route.query,
      this.$route.params
    );
    this.getSearchList();
  },
  watch: {
    // 监听在search页面的路由变化，发送请求
    $route() {
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      this.getSearchList();
      // 将之前的参数id置空，防止下次请求时携带多余参数
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // 问题：如何清除地址栏中不需要的params参数？？？
      // this.searchParams.keyword = '' // 无效
      // this.$route.params = undefined // 无效
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>