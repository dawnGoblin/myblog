<template>
  <div class="header-wraper">
    <el-row style="width:100%">
      <el-col :span="4" :offset="4">
        <h1 class="header-title">
          <router-link to="/">StarBlog</router-link>
        </h1>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          v-model="search"
          class="nav-search"
          autocomplete="off"
          name="aa"
        ></el-input>
      </el-col>
      <el-col :span="8" :offset="2">
        <nav class="header-nav">
          <ul>
            <li><router-link to="/admin/settings">设置</router-link></li>
            <li><router-link to="/admin/comments">评论</router-link></li>
            <li><router-link to="/admin/draft">草稿</router-link></li>
            <li><router-link to="/admin/tags">标签</router-link></li>
            <li><router-link to="/admin/newEssay">随笔</router-link></li>
          </ul>
        </nav>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      search: ""
    };
  }
};
</script>
<style scoped>
.header-wraper {
  position: fixed;
  top: 0;
  display: flex;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
  z-index: 999;
  background-color: #fff;
}
.blog-header {
  display: flex;
  width: 960px;
  margin: 0 auto;
  justify-content: space-between;
  padding: 0 15px;
}
.header-title {
  font-size: 20px;
  font-weight: 700;
}
.header-nav {
  display: -webkit-box;
  margin-right: 5rem;
}
li {
  display: inline-block;
  margin-right: 1.5rem;
  cursor: pointer;
}
</style>
