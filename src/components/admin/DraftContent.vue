<template>
  <section class="blog-body">
    <div class="detail">
      <h1 class="detail-title">{{draft.title}}</h1>
      <div class="detail-content">
        <p v-html="draft.shtml"></p>
      </div>
      <div style="margin-top:10px">
        <el-tag type="info" style="border:none;margin-right:10px" v-for="(tag,index) in tags" :key="index">{{tag}}</el-tag>
      </div>
      <div style="text-align:center;margin:10px 0">
        <el-button type="primary" size="small" @click="update">编辑</el-button>
        <el-button type="danger" size="small" @click="del">删除</el-button>
        <el-button type="success" size="small" @click="publish">发布</el-button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      draft: [],
      tags:[]
    };
  },
  methods: {
    del() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("/api/admin/delArticle", {
              id: this.draft.id
            })
            .then(response => {
              if (response.data.status == true) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/admin/draft"
                });
              } else if (response.data.status == false) {
                this.$message.error("删除失败");
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    update() {
      this.$router.push({
        path: "/admin/update",
        query: { draft: this.draft }
      });
    },
    publish() {
      this.axios
        .post("/api/admin/updateArticle", {
          state: 1,
          id: this.draft.id
        })
        .then(response => {
          if (response.data.status == true) {
            this.$message({
              message: "发布成功",
              type: "success"
            });
            this.$router.push({
              path: "/admin/draft"
            });
          } else if (response.data.status == false) {
            this.$message.error("发布失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.draft = this.$route.query.article;
    let str = this.draft.type.substring(1, this.draft.type.length - 1).replace(/\"/g, "");
    this.tags = str.split(",");
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
</style>
