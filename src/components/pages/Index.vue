<template>
  <section>
    <Header></Header>
    <section class="blog-body">
      <p v-if="flag==0" class="nothing">Nothing</p>
      <div v-else class="blog-list">
        <ul class="list-article">
          <li class="article" v-for="(article,index) in articleList" :key="article.id">
            <div class="article-header">
              <h2 class="article-title">
                <!-- <router-link to="{path:'/contents',query:{id:article.id}}" class="title-link">{{article.title}}</router-link> -->
                <span class="title-link" @click="tocontent(article)">{{article.title}}</span>
                <el-tag
                  size="mini"
                  hit
                  v-for="tag in tags[index]"
                  :key="tag"
                  style="margin-right:10px"
                >{{tag}}</el-tag>
              </h2>
              <p class="article-body" >{{article.summary | cutString(180)}}</p>
            </div>
            <div class="article-footer">
              <span class="iconfont icon-riqi icons">
                <span class="content">{{article.post_time | formatDate('yyyy-MM-dd')}}</span>
              </span>
              <span class="iconfont icon-chakantiezihuifu icons">
                <span class="content">{{article.comment_count}}评论</span>
              </span>
              <span class="iconfont icon-yanjing icons">
                <span class="content">{{article.view}}阅读量</span>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <el-pagination
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="count"
        :page-size="5"
        style="text-align: center;margin: 15px auto;"
      ></el-pagination>
    </section>
    <Footer></Footer>
  </section>
</template>
<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import marked from "marked";
export default {
  data() {
    return {
      articleList: [],
      tags: [],
      flag: 0,
      pageNum: 1,
      pageSize: 5,
      count:0
    };
  },
  components: { Header, Footer },
  methods: {
    tocontent(article) {
      this.$router.push({ path: "/contents", query: { article } });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.getData(val,this.pageSize);
      this.pageNum = val;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      // this.pageSize = val;
    },
    getData(pageNum,pageSize){
      this.axios
      .get("/api/getArticle", {
        params: { state: 1, pageNum,pageSize }
      })
      .then(response => {
        this.articleList = response.data[0];
        this.count=response.data[1][0].count;
        this.flag = this.articleList.length < 1 ? 0 : 1;
        for (let item of this.articleList) {
          let str = item.type
            .substring(1, item.type.length - 1)
            .replace(/\"/g, "");
          let tag = str.split(",");
          this.tags.push(tag);
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
  mounted() {
    this.getData(this.pageNum,this.pageSize)
  }
};
</script>
<style scoped>
/* @import '~@/assets/icons/iconfont.css'; */
.icons {
  font-size: 14px;
  color: #909399;
  margin-right: 10px;
}
.content {
  margin-left: 3px;
}
.blog-body {
  max-width: 770px;
  margin: 100px auto 0;
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
}
.blog-list ul {
  list-style: none;
}
.title-link {
  vertical-align: middle;
  cursor: pointer;
}
.title-link:hover {
  color: #409eff;
}
.artic a {
  color: #24292e;
}

.article {
  margin: 0 0 15px;

  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 0;
}
.article-header {
  padding: 10px 20px 0;
  /* border-bottom: 1px solid #f2f6fc; */
}
.article-footer {
  padding: 8px 20px;
  border-top: 1px solid #f3f3f3;
  line-height: 27px;
  overflow: hidden;
  font-size: 12px;
}
.blog-list .article .article-title {
  font-size: 20px;
  font-weight: 400;
}
.blog-list .article .article-body {
  margin: 10px 0;
  color: #666;
  word-break: break-all;
  /* overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; */
}
</style>

