<template>
  <div>
    <!-- 三级联动全局组件 -->
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor"/>
    <Brand />
  </div>
</template>

<script>
import ListContainer from "@/pages/Home/ListContainer";
import Recommend from "@/pages/Home/Recommend";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";

import { mapActions, mapState } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapState(["count"]),
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  },
  methods: {
    ...mapActions(["increment"]),

    ...mapActions(["decrement"]),
  },
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    // 获取FloolList数据
    this.$store.dispatch("getFloorList");
    // 获取用户登录信息(携带token验证)
    this.$store.dispatch('getUserinfo')
  },
};
</script>

<style>
</style>