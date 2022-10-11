<template>
  <div class="fr page">
    <div class="sui-pagination clearfix">
      <ul>
        <li
          class="prev"
          :class="{ disabled: pageNo === 1 }"
          @click="pageNo > 1 ? $emit('getPageNo', pageNo - 1) : null"
        >
          <a>« 上一页</a>
        </li>
        <li
          v-show="startNumAndEndNum.start > 1"
          :class="{ active: pageNo === 1 }"
          @click="$emit('getPageNo', 1)"
        >
          <a>1</a>
        </li>
        <li class="dotted" v-show="startNumAndEndNum.start > 2">
          <span>...</span>
        </li>

        <!-- 中间部分 -->
        <li
          v-for="(page, index) in pagesArr"
          :key="index"
          :class="{ active: pageNo === page }"
          @click="$emit('getPageNo', page)"
        >
          <a>{{ page }}</a>
        </li>

        <li class="dotted" v-show="startNumAndEndNum.end < totalPage - 1">
          <span>...</span>
        </li>
        <li
          v-show="startNumAndEndNum.end < totalPage"
          :class="{ active: pageNo === totalPage }"
          @click="$emit('getPageNo', totalPage)"
        >
          <a>{{ totalPage }}</a>
        </li>
        <li
          class="next"
          :class="{ disabled: pageNo === totalPage }"
          @click="pageNo < totalPage ? $emit('getPageNo', pageNo + 1) : null"
        >
          <a>下一页 »</a>
        </li>
      </ul>
      <div>
        <span>共 {{ total }} 条</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    // 连续页码起始数字与结束数字
    startNumAndEndNum() {
      const { pageNo, continues, totalPage } = this;
      let start = 0;
      let end = 0;
      // 如果总页数少于连续页数
      if (totalPage < continues) {
        start = 1;
        end = totalPage;
      } else {
        start = pageNo - Math.floor(continues / 2);
        end = pageNo + Math.floor(continues / 2);
        // start出现0/负数
        if (start < 1) {
          start = 1;
          end = continues;
        }
        // end大于总页数
        if (end > totalPage) {
          start = totalPage - continues + 1;
          end = totalPage;
        }
      }
      return { start, end };
    },
    pagesArr() {
      let arr = [];
      // 连续页码个数
      arr.length =
        this.totalPage < this.continues ? this.totalPage : this.continues;
      // 第一个连续页码
      let pageNum = this.startNumAndEndNum.start;
      for (let i = 0; i < arr.length; i++) {
        arr[i] = pageNum;
        pageNum++;
      }
      return arr;
    },
  },
};
</script>

<style scoped lang="less">
.page {
  display: flex;
  justify-content: center;
  overflow: hidden;

  .sui-pagination {
    margin: 18px 0;

    ul {
      margin-left: 0;
      margin-bottom: 0;
      vertical-align: middle;
      float: left;

      li {
        line-height: 18px;
        display: inline-block;

        a {
          position: relative;
          float: left;
          background-color: #fff;
          padding: 9px 18px;
          border: 1px solid #e0e9ee;
          margin-left: -1px;
          line-height: 18px;
          text-decoration: none;
          font-size: 14px;
          color: #333;
          cursor: pointer;
        }

        &.active {
          a {
            background-color: #e1251b;
            color: #fff;
            cursor: default;
          }
        }

        &.prev {
          a {
            margin-left: 0px;
            background-color: #fafafa;
          }
        }

        &.disabled {
          a {
            color: #999;
            cursor: default;
          }
        }

        &.dotted {
          span {
            position: relative;
            float: left;
            padding: 9px 18px;
            border: 1px solid #e0e9ee;
            margin-left: -1px;
            background-color: #fff;
            font-size: 14px;
            line-height: 18px;
            text-decoration: none;
            color: #333;
          }
        }

        &.next {
          a {
            background-color: #fafafa;
          }
        }
      }
    }

    div {
      margin-top: 10px;
      margin-left: 20px;
      color: #333;
      font-size: 14px;
      float: left;
      width: 80px;
    }
  }
}
</style>