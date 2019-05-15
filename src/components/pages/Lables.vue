<template>
  <section>
    <Header></Header>
    <section class="tags">
      <el-tag v-for="tag in tags" :key="tag.id" @click="selectBytag(tag.id)">{{tag.name}}</el-tag>
    </section>
    <Footer></Footer>
  </section>
</template>
<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
export default {
  data() {
    return {
      tags: []
    };
  },
  components: { Header, Footer },
  mounted() {
    this.axios
      .get("/api/admin/getTagAll")
      .then(response => {
        this.tags = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    selectBytag(id) {
      this.axios
      .get("/api/admin/getArticleById",{params:{id}})
      .then(response => {
        this.$router.push({ path: "/", query: { articleList:response.data } });
      })
      .catch(error => {
        console.log(error);
      });
      console.log(id)
    }
  }
};
</script>
<style scoped>
.tags {
  max-width: 770px;
  margin: 100px auto 50px;
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
}
span {
  margin: 0 10px 10px;
  border: none;
  cursor: pointer;
}
</style>

