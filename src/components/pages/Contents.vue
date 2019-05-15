<template>
  <article>
    <Header></Header>
    <section class="blog-body">
      <div class="detail">
        <h1 class="detail-title">{{article.title}}</h1>
        <div class="detail-content">
          <p v-html="article.shtml"></p>
        </div>
        <p class="detail-tags"></p>
        <div class="detail-admin">
          <p>发布于 {{article.post_time | formatDate('yyyy-MM-dd')}}</p>
          <p>浏览{{article.view}}次</p>
        </div>
        <div>
          <el-tag
            type="info"
            style="border:none;margin-right:10px"
            v-for="tag in tags"
            :key="tag"
          >{{tag}}</el-tag>
          <div class="blog-comment">
            <div class="comment-list">
              <ul>
                <li v-for="(item,index) in commentList" :key="index">
                  <div class="list-header clearfix">
                    <div class="header-reply">
                      <span>{{item.username}}</span>
                    </div>
                    <span class="header-time">{{item.postTime| formatDate('yyyy-MM-dd')}}</span>
                  </div>
                  <div class="list-content">
                    <p>{{item.comment}}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div v-show="islogin==true" style="margin-top:10px">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
              <el-button
                type="primary"
                size="small"
                plain
                style="margin-top:10px;margin-left: 89%;"
                @click="refer"
              >提交留言</el-button>
            </div>
            <div class="comment-unlogin" v-show="islogin==false">
              <el-button type="primary" @click="tologin">登录</el-button>
              <p>欢迎留言交流</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </article>
</template>
<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
export default {
  data() {
    return {
      article: [],
      textarea: "",
      islogin: false,
      comments: [], //要传的数组
      commentList: [], //初始数组
      username: "",
      tags: []
    };
  },
  name: "contents",
  components: { Header, Footer },
  methods: {
    tologin() {
      this.$router.push({ path: "/login" });
    },
    refer() {
      if (this.textarea.length < 1) {
        this.$message({
          message: "评论不能为空",
          type: "warning"
        });
      } else {
        let username = this.username;
        let postTime = new Date().getTime();
        if (this.commentList.length > 0) {
          for (let item of this.commentList) {
            this.comments.push(item);
          }
        }
        this.comments.push({ username, comment: this.textarea, postTime });
        this.axios
          .post("/api/insertComments", {
            comments: JSON.stringify(this.comments),
            id: this.article.id
          })
          .then(response => {
            if (response.data.status == true) {
              this.commentList.push({
                username,
                comment: this.textarea,
                postTime
              });
              this.textarea = "";
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            this.$message.error("服务器错误");
            console.log(error);
          });
      }
    }
  },
  mounted() {
    this.username = sessionStorage.getItem("username") || "";
    if (this.username.length > 0) {
      this.islogin = true;
    }
    this.article = this.$route.query.article;
    let str = this.article.type
      .substring(1, this.article.type.length - 1)
      .replace(/\"/g, "");
    this.tags = str.split(",");
    this.commentList = JSON.parse(this.article.comments) || [];
    this.axios
      .post("/api/updateCount", {
        view: this.article.view + 1,
        count: this.commentList.length,
        id: this.article.id
      })
      .then(response => {
        // console.log(response)
      })
      .catch(error => {
        this.$message.error("服务器错误");
        console.log(error);
      });
  }
};
</script>
<style scoped>
.detail-title {
  margin-bottom: 30px;
}
.detail-content {
  overflow: scroll;
}
.detail-admin {
  font-size: 14px;
  color: #999;
  margin: 20px 0;
}
.detail .detail-admin p {
  display: inline-block;
  margin-right: 15px;
}
.blog-comment .comment-unlogin {
  background-color: #eee;
  text-align: center;
  border-radius: 3px;
  padding: 15px;
}
.blog-comment .comment-unlogin p {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}
.blog-comment .comment-list ul li {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
.blog-comment .comment-list ul .list-header {
  position: relative;
  margin-bottom: 10px;
  font-size: 14px;
}
.blog-comment img {
  border-radius: 3px;
  margin-right: 15px;
  display: inline-block;
  vertical-align: middle;
}
.blog-comment .comment-list ul .list-header .header-reply {
  display: inline-block;
  vertical-align: top;
  line-height: 1;
}
.blog-comment .comment-list ul .list-header .header-time {
  position: absolute;
  top: 12px;
  left: 0;
  font-size: 13px;
  color: #999;
}
.blog-comment .comment-list ul .list-content {
  margin-bottom: 10px;
}
ul {
  list-style: none;
}
</style>

