<template>
  <div>
    <Header></Header>
    <!-- 展示路由组件 -->
    <router-view></router-view>
    <!-- Footer只在Home、Search页显示 -->
    <Footer v-show="$route.meta.isShowFooter"></Footer>
  </div>
</template>

<script>
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  mounted() {
    // 发送请求，获取三级联动导航数据
    this.$store.dispatch("getCategoryList");
  }
}
</script>

<style>

</style>
