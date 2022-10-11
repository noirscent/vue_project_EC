<template>
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派 -->
      <div @mouseleave="leaveShowNav" @mouseenter="enterShowNav">
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画 -->
        <transition name="showNav">
          <!-- 三级联动 -->
          <div class="sort" v-show="isShowNav">
            <!-- 利用事件委派+编程式导航实现路由的跳转与传递参数 -->
            <div class="all-sort-list2" @click="goSearch">
              <!-- 一级分类 -->
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex === index }"
              >
                <h3 @mouseenter="enterIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 二、三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{
                    display: currentIndex === index ? 'block' : 'none',
                  }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { throttle } from "lodash";

export default {
  name: "TypeNav",
  data() {
    return {
      // 存储用户鼠标移入到哪一个一级分类导航项
      currentIndex: -1,
      isShowNav: false,
    };
  },
  methods: {
    // 使用节流策略，记录用户鼠标移入哪一个一级分类导航项
    enterIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 50),
    // 鼠标移出，修改currentIndex为初始值-1，并隐藏一级导航栏
    leaveShowNav() {
      this.currentIndex = -1;
      if (this.$route.name !== "home") {
        this.isShowNav = false;
      }
    },
    // 路由跳转
    goSearch(event) {
      let { categoryname, category1id, category2id, category3id } =
        event.target.dataset;

      if (categoryname) {
        // 路由跳转参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 一、二、三级分类的id
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        // 合并params参数
        location.params = this.$route.params;
        location.query = query;
        // 路由跳转
        this.$router.push(location);
      }
    },
    // 鼠标移入，展示一级导航栏
    enterShowNav() {
      if (this.$route.name !== "home") {
        this.isShowNav = true;
      }
    },
  },
  mounted() {
    // 若当前页面不是home页面，就显示一级导航栏
    if (this.$route.name === "home") {
      this.isShowNav = true;
    }
  },

  computed: {
    ...mapState({
      // 对象写法，右侧是函数，函数参数为state，即为大仓库
      categoryList: (state) => {
        return state.home.categoryList;
      },
    }),
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        cursor: pointer;
        .item {
          // css修改一级菜单hover样式
          // &:hover {
          //   background-color: rgba(137, 207, 235, .5);
          // }

          &.cur {
            background-color: rgba(137, 207, 235, 0.5);
          }

          h3 {
            line-height: 27px;
            font-size: 15px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              text-decoration: none;
              color: #333;
            }
          }

          .item-list {
            // display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }
      }
    }

    // 隐藏三级联动导航滚动条
    .sort::-webkit-scrollbar {
      width: 0 !important;
    }

    // 过渡动画样式
    .showNav-enter {
      height: 0px;
      // 解决文字和背景动画不同步问题
      overflow: hidden;
    }

    .showNav-enter-to {
      height: 461px;
      overflow: auto;
    }

    .showNav-enter-active {
      transition: all 0.3s linear;
    }
  }
}
</style>