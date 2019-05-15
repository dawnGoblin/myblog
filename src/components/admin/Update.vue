<template>
  <section class="blog-body">
    <div class="admin-publish">
      <el-input v-model="title" placeholder="文章标题"></el-input>
      <div id="editor" style="text-align:left"></div>
      <mavon-editor
        v-model="context"
        :toolbars="toolbars"
        @imgAdd="$imgAdd"
        class="blogcontent"
        ref="md"
      />
      <el-row style="margin-bottom:20px">
        <el-col :span="16">
          <el-select
            v-model="tags"
            multiple
            :popper-append-to-body="false"
            placeholder="请选择标签"
            style="width:100%"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-button type="primary" size="medium" @click="saveArticle">存为草稿</el-button>
          <el-button type="primary" size="medium" @click="publish">发布</el-button>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
export default {
  data() {
    return {
      title: "",
      editorContent: "",
      draft: [],
      context: "", //输入的数据
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        navigation: true // 导航目录
      },
      options: [],
      tags: [],
      username: ""
    };
  },
  methods: {
    publish() {
      if (this.title.length < 1) {
        this.$message({
          message: "标题不能为空",
          type: "warning"
        });
      } else if (this.context.length < 1) {
        this.$message({
          message: "内容不能为空",
          type: "warning"
        });
      } else if (this.tags.length < 1) {
        this.$message({
          message: "请选择标签",
          type: "warning"
        });
      } else {
        this.axios
          .post("/api/admin/updArticle", {
            id: this.draft.id,
            title: this.title,
            content: this.context,
            tags: JSON.stringify(this.tags),
            state: 1
          })
          .then(response => {
            if (response.data.status == true) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.push({ path: "/admin/settings" });
            } else if (response.data.status == false) {
              this.$message.error("修改失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("imgFile", $file);
      this.axios({
        url: "/api/uploadImg",
        method: "post",
        data: formdata
        // headers: { "Content-Type": "multipart/form-data" }
      }).then(response => {
        console.log(response);
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        this.$refs.md.$img2Url(pos, response.data.url);
      });
    },
    saveArticle() {
      if (this.title.length < 1) {
        this.$message({
          message: "标题不能为空",
          type: "warning"
        });
      } else if (this.context.length < 1) {
        this.$message({
          message: "内容不能为空",
          type: "warning"
        });
      } else if (this.tags.length < 1) {
        this.$message({
          message: "请选择标签",
          type: "warning"
        });
      } else {
        this.axios
          .post("/api/admin/updArticle", {
            id:this.draft.id,
            username: this.username,
            title: this.title,
            content: this.context,
            tags: JSON.stringify(this.tags),
            state: 0
          })
          .then(response => {
            if (response.data.status == true) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$router.push({ path: "/admin/settings" });
            } else if (response.data.status == false) {
              this.$message.error("保存失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  mounted() {
    //初始化数据
    this.draft = this.$route.query.draft;
    this.title = this.draft.title;
    this.context = this.draft.summary;
    this.username = sessionStorage.getItem("username");
    this.axios
      .get("/api/admin/getTagAll")
      .then(response => {
        let data = response.data;
        this.options = data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
<style scoped>
.blogcontent {
  height: 400px;
  margin-top: 20px;
  margin-bottom: 20px;
}
span {
  margin-right: 5px;
  cursor: pointer;
}
</style>
